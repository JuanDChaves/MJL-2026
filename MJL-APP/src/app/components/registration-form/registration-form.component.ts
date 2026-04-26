import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonList,
  IonText,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  call,
  documentText,
  mail,
  lockClosed,
  camera,
  chevronBack,
  personCircle,
  restaurant,
  people,
  clipboard,
  beer,
  flash,
  qrCodeOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { LoginService } from '../../services/login-service';
import { DbService } from '../../services/db-service';
import { perfilRol } from '../../types/typeRol';
import { LocalStorageService } from '../../services/local-storage-service';
import { RegisterFormService } from 'src/app/services/register-form-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IUser } from 'src/app/interfaces/IUsers';

type perfilUser = {
  value: perfilRol;
  label: string;
  icon: string;
};

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonList,
    IonText,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    ReactiveFormsModule,
  ],
})
export class RegistrationFormComponent implements ViewWillEnter, OnInit {
  router = inject(Router);
  userService = inject(UserService);
  loginServ = inject(LoginService);
  storageServ = inject(LocalStorageService);
  dbService = inject(DbService);
  formService = inject(RegisterFormService);

  form = toSignal(this.formService.form$, {
    initialValue: this.formService.registerForm,
  });
  profilelist = toSignal(this.formService.profileList$, { initialValue: [] });

  showPassword = signal(false);
  profilePhotoUrl = signal<string | null>(null);
  isSubmitting = signal(false);

  errorMessage: string | null = null;  

  constructor() {  }

  ngOnInit(): void {
    addIcons({
      person,
      call,
      documentText,
      mail,
      lockClosed,
      camera,
      chevronBack,
      personCircle,
      restaurant,
      people,
      clipboard,
      beer,
      flash,
      qrCodeOutline,
    });
  }

  async ionViewWillEnter() {
    this.formService.cleanForm();
    this.profilePhotoUrl.set(null);
    this.errorMessage = null;
    await this.userService.loadUserData();
    await this.formService.buildForm();
  }

  get f() {
    return this.form().controls;
  }

  getErrorMessage(field: string): string | null {
    const control = this.formService.registerForm.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.hasError('required')) {
      return 'Campo obligatorio';
    }
    if (control.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    if (control.hasError('email')) {
      return 'Correo inválido';
    }
    if (control.hasError('pattern')) {
      if (field === 'dni') {
        return 'Solo números (7-8 dígitos)';
      } else if (field === 'cuil') {
        return 'Solo numeros de 11 digitos';
      } else if (field === 'apellidos' || field === 'nombres') {
        return 'Solo letras';
      }
    }
    return null;
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  onSelectPhoto() {
    // TODO: Implementar selección de foto
    // Por ahora simulamos una foto
    this.profilePhotoUrl.set('foto de la camara');
  }

  removePhoto() {
    this.profilePhotoUrl.set(null);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private getValuesFromForm(user_id: string): IUser {
    let isClientToRegister: boolean = false;
    if(!this.userService.isLogged() || this.userService.userData()?.perfil === 'metre') {
      isClientToRegister = true;
    }
    return {
        user_id: user_id,
        apellidos: this.form().value.apellidos,
        nombres: this.form().value.nombres,
        dni: this.form().value.dni,
        correo_electronico: this.form().value.correoElectronico,
        perfil: this.userService.isLogged() ? this.form().value.perfil : 'cliente',
        activo: !isClientToRegister,
        url_foto_perfil: this.profilePhotoUrl(),
        cuil: this.form().value.cuil
    }
      
  }

  async onSubmit() {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage = null;

    const dni = this.form().value.dni!;
    let userId: string | null = null;

    try {
      // chequeamos que NO exista un usuario con este dni
      const userExist = await this.userService.userExist(dni);
      if (userExist) {
        this.errorMessage = 'Ya existe un usuario con este dni';
        return;
      }

      if (this.userService.isLogged()) {
        //si esta logueado registrar sin cerrar la sesion actual
        const result = await this.loginServ.createUserViaEdgeFunction(
          this.form().value.correoElectronico!,
          this.form().value.clave!
        );

        if (result.error) {
          this.errorMessage =
            result.error.message || 'Error al crear el usuario';
          return;
        }
        userId = result.userId;
      } else {
        // Sino esta logueado, crear usuario y cerrar sesion
        const { data, error } = await this.loginServ.createAccount(
          this.form().value.correoElectronico!,
          this.form().value.clave!
        );
        if (error) {
          if (error.code === 'user_already_exists') {
            this.errorMessage = 'El correo ya está registrado';
            return;
          }
        }
        userId = data.user.id;
        this.loginServ.closeSession();
      }

      // 2. Obtener datos del formulario
      const user = this.getValuesFromForm(userId!);

      // 3 Si es cliente guardamos en solicitudes
      if (user.perfil === 'cliente') {
        const { error: solicitudError } =
          await this.userService.loadUserAuthorization({
            identificacion: user.dni,
            estado: null,
            apellidos: user.apellidos,
            nombres: user.nombres,
            url_foto_perfil: user.url_foto_perfil,
            fecha_registro: null,
          });
        if (solicitudError) {
          this.errorMessage = `Error al guardar en usuarios pendientes de aprobacion`;
          return;
        }
      }

      // 4. Guardar datos en tabla usuarios
      const { error: insertError } = await this.dbService.insert(
        'usuarios',
        user
      );

      if (insertError) {
        console.log(insertError);
        this.errorMessage = `Error al guardar en usuarios`;
      } else {
        // 5. Si es cliente, notificar a supervisores/duenios
        if (user.perfil === 'cliente') {
          await this.dbService.insert('notifications', {
            user_id: user.user_id,
            title: 'Nuevo cliente pendiente',
            body: `${user.nombres} ${user.apellidos} solicita acceso`,
            data: { cliente_id: userId, tipo: 'registro_pendiente' },
          });
        }

        this.formService.registerForm.reset();
        this.profilePhotoUrl.set(null);
        this.errorMessage = null;
        if (
          this.userService.userData()?.perfil === 'metre' ||
          this.userService.userData()?.perfil === 'duenio' ||
          this.userService.userData()?.perfil === 'supervisor'
        ) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally{
      this.isSubmitting.set(false);
    }

  }
  scanQr() {
    throw new Error('Method not implemented.');
  }
}
