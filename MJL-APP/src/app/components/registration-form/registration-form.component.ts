import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';
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

  form = toSignal(this.formService.form$, {initialValue: this.formService.registerForm});
  profilelist = toSignal(this.formService.profileList$,{initialValue:[]});

  showPassword = signal(false);
  profilePhotoUrl = signal<string | null>(null);
  isSubmitting = signal(false);

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
  async ionViewWillEnter(){
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
        if( !this.userService.isLogged() || this.userService.userData()?.perfil === 'metre')
        return 'Solo números (7-8 dígitos)';
      }
      return 'Solo numeros de 11 digitos';
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

  getValuesFromForm(userId: any) {
    if (!this.userService.isLogged()) {
      this.form().value.perfil = 'cliente';
    }

    return {
      user_id: userId,
      apellidos: this.form().value.lastname,
      nombres: this.form().value.name,
      identificacion: this.form().value.identificacion,
      correo_electronico: this.form().value.email,
      perfil: this.form().value.profiles,
      activo: false,
      url_foto_perfil: this.profilePhotoUrl(),
    };
  }

  async onSubmit() {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      console.log('campos del form invalidos');
      return;
    }

    this.isSubmitting.set(true);

    console.log('Formulario de registro:', this.form().value);

    // chequeamos que NO exista el usuario
    const id = this.form().value.identificacion!;
    const email = this.form().value.correoElectronico!;

    const userExist = await this.userService.userExist(id, email);
    if (userExist) {
      console.log('El usuario ya existe');
      this.isSubmitting.set(false);
      return;
    }

    // 1. Crear usuario en Supabase Auth
    const responseAuth = await this.loginServ.createAccount(
      this.form().value.correoElectronico!,
      this.form().value.clave!
    );   

    // 2. Obtener el user_id del usuario creado
    const userId = responseAuth.data?.user?.id;

    if (!userId) {
      console.log('Error al obtener user_id', responseAuth);
      this.isSubmitting.set(false);
      return;
    }
    const user = this.getValuesFromForm(userId);

    // 3. Guardar datos en tabla usuarios
    const { error: insertError } = await this.dbService.insert(
      'usuarios',
      user
    );
    if (insertError) {
      console.log('Error al guardar en usuarios:', insertError);
    } else {
      console.log('Usuario guardado correctamente en tabla usuarios');
    }

    setTimeout(() => {
      this.isSubmitting.set(false);
      if(this.userService.isLogged()){
        this.router.navigate(['/home']);
      }else{
        this.router.navigate(['/login']);
      }
    }, 1500);
  }
}
