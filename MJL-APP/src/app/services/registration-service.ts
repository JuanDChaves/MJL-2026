import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IUserToRegister } from '../interfaces/IUserToRegister';
import { IUser } from '../interfaces/IUser';
import { UserService } from './user-service';
import { LoginService } from './login-service';
import { IResult } from '../interfaces/IResult';
import { PhotoService } from './photo-service';
import { NotificationsService } from './notifications-service';
import { IUserUnauthorizedToRegister } from '../interfaces/IUserUnauthorizedToRegister';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  userService = inject(UserService);
  loginService = inject(LoginService);
  photoService = inject(PhotoService);
  notificationsService = inject(NotificationsService);

  private async checkUserExists(dni: string): Promise<IResult<void>> {
    const userExist = await this.userService.userExist(dni);
    if (userExist) {
      return {
        success: false,
        error: { message: 'Ya existe un usuario con este dni' },
        data: null,
      };
    }
    return { success: true, error: { message: '' }, data: null };
  }

  private async getUserObject(controls: {
    [key: string]: AbstractControl<any, any, any>;
  }): Promise<IUserToRegister> {
    const isClientToRegister: boolean =
      !this.userService.isLogged() ||
      this.userService.userData()?.perfil === 'metre';

    return {
      user_id: null,
      apellidos: controls['apellidos'].value,
      nombres: controls['nombres'].value,
      dni: controls['dni'].value,
      correo_electronico: controls['correoElectronico'].value,
      perfil: this.userService.isLogged()
        ? controls['perfil'].value
        : 'cliente',
      activo: !isClientToRegister,
      url_foto_perfil: null,
      cuil: controls['cuil'].value,
    };
  }

  async registerUser(controls: {
    [key: string]: AbstractControl<any, any, any>;
  }): Promise<IResult<any>> {
    try {
      const user = await this.getUserObject(controls);
      const isExist = await this.checkUserExists(user.dni);
      if (!isExist.success) return isExist;//revisar en algun momento
      let resultCreateAccount = null;
      if (this.userService.isLogged()) {
        resultCreateAccount = await this.createUserAccountViaEdgeFunction(
          user.correo_electronico,
          controls['clave'].value
        );
        if (!resultCreateAccount.success) return resultCreateAccount;
      } else {
        resultCreateAccount = await this.createUserAccountViaCreateAccount(
          user.correo_electronico,
          controls['clave'].value
        );
        if (!resultCreateAccount.success) return resultCreateAccount;
      }
      const url = await this.loadPhoto(
        controls['profileImg'].value,
        controls['dni'].value
      );

      user.user_id = resultCreateAccount.data!;
      user.url_foto_perfil = url;

      if (user.perfil === 'cliente') {
        const resultAuth = await this.loadUserAuthorization(user);
        if (!resultAuth.success) return resultAuth;

        const resultNotification = await this.loadNotificationToSuperOrDuenio(
          user
        );
        if (!resultNotification.success) return resultNotification;
      }
      return await this.insertUser(user);
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Error inesperado en el registro' },
        data: null,
      };
    }
  }

  private async createUserAccountViaEdgeFunction(
    correoElectronico: string,
    clave: string
  ): Promise<IResult<string>> {
    const result = await this.loginService.createUserViaEdgeFunction(
      correoElectronico,
      clave
    );
    if (result.error)
      return {
        success: false,
        error: { message: result.error.message },
        data: null,
      };
    return { success: true, error: null, data: result.userId };
  }

  private async createUserAccountViaCreateAccount(
    correoElectronico: string,
    clave: string
  ): Promise<IResult<string>> {
    const { data, error } = await this.loginService.createAccount(
      correoElectronico,
      clave
    );
    if (error) {
      if (error.code === 'user_already_exists') {
        return {
          success: false,
          error: { message: 'El correo ya está registrado' },
          data: null,
        };
      }
      return {
        success: false,
        error: { message: error.message || 'Error al crear cuenta' },
        data: null,
      };
    }
    if (!data?.user?.id) {
      return {
        success: false,
        error: { message: 'Error al obtener ID de usuario' },
        data: null,
      };
    }
    this.loginService.closeSession();
    return { success: true, error: null, data: data.user.id };
  }

  private async loadPhoto(
    photoUrl: string,
    dni: string
  ): Promise<string | null> {
    try {
      const blobImg = await this.photoService.getPhotoBlob(photoUrl);
      const publicUrl = await this.photoService.uploadProfilePhoto(blobImg, dni);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  }

  private async loadUserAuthorization(user: IUserToRegister): Promise<IResult<void>> {
    const userUnauthorized: IUserUnauthorizedToRegister = {
      apellidos: user.apellidos,
      nombres: user.nombres,
      dni: user.dni,
      url_foto_perfil: user.url_foto_perfil,
      correo_electronico: user.correo_electronico,
      estado:true
    };
    const { error: solicitudError } =
      await this.userService.loadUserAuthorization(userUnauthorized);
    if (solicitudError) {
      return {
        success: false,
        error: {
          message: `Error al guardar en usuarios pendientes de aprobacion`,
        },
        data: null,
      };
    }
    return { success: true, error: null, data: null };
  }

  private async loadNotificationToSuperOrDuenio(
    user: IUserToRegister
  ): Promise<IResult<void>> {
    const { error } = await this.notificationsService.insertNotification(user);
    if (error) {
      return {
        success: false,
        error: { message: 'Error al enviar notificacion' },
        data: null,
      };
    }
    return { success: true, error: null, data: null };
  }

  private async insertUser(user: IUserToRegister): Promise<IResult<IUser>> {
    const {data, error } = await this.userService.insert(user);
    if (error) {
      return {
        success: false,
        error: { message: 'Error al insertar usuario' },
        data: null,
      };
    }
    return { success: true, error: null, data: data as IUser };
  }
}
