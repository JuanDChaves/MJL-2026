import { Component, inject, signal } from '@angular/core';
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
export class RegistrationFormComponent implements ViewWillEnter {
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

  identificationLabel = () => {
    const user = this.userService.userData();
    if (!user || user.perfil === 'metre') {
      return 'Número de documento';
    }
    return 'CUIL';
  };

  identificationPlaceholder = () => {
    const user = this.userService.userData();
    if (!user || user.perfil === 'metre') {
      return 'Ingrese DNI';
    }
    return 'Ingrese CUIL';
  };

  constructor() {
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
      if (field === 'identificacion') {
        if (
          !this.userService.isLogged() ||
          this.userService.userData()?.perfil === 'metre'
        ) {
          return 'Solo números (7-8 dígitos)';
        }
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

  getValuesFromForm(): Promise<IUser> {
    if (!this.userService.isLogged()) {
      this.form().value.perfil = 'cliente';
    }

    return new Promise((resolve, reject) => {
      resolve({
        apellidos: this.form().value.apellidos,
        nombres: this.form().value.nombres,
        identificacion: this.form().value.identificacion,
        correo_electronico: this.form().value.correoElectronico,
        perfil: this.form().value.perfil,
        activo: false,
        url_foto_perfil: this.profilePhotoUrl(),
      });
    });
  }

  async onSubmit() {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage = null;

    const id = this.form().value.identificacion!;
    let userId: string | null = null;

    try {
      // chequeamos que NO exista un usuario con esa identificacion
      const userExist = await this.userService.userExist(id);
      if (userExist) {
        this.errorMessage = 'Ya existe un usuario con esa identificacion';
        this.isSubmitting.set(false);
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
          this.isSubmitting.set(false);
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
            this.isSubmitting.set(false);
            return;
          }
        }
        this.loginServ.closeSession();
      }

      // 2. Obtener datos del formulario
      const user = await this.getValuesFromForm();

      // 3 Si es cliente guardamos en solicitudes
      if(user.perfil === 'cliente'){
        const { error: solicitudError } = await this.userService.loadUserAuthorization(
          {
            identificacion: user.identificacion,
            estado: null,
            apellidos: user.apellidos,
            nombres: user.nombres,
            url_foto_perfil: user.url_foto_perfil,
            fecha_registro: null,
          }
        );
        if (solicitudError) {
          this.errorMessage = `Error al guardar en solicitudes:`;
          this.isSubmitting.set(false);
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
        this.formService.registerForm.reset();
        this.profilePhotoUrl.set(null);
        this.errorMessage = null;
        this.isSubmitting.set(false);
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
    }
  }
}
