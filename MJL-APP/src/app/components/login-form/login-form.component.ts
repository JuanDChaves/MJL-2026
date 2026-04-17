import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonList,
  IonText,
  IonSpinner,
  IonFabButton,
  IonFab,
  IonFabList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mail,
  lockClosed,
  eye,
  eyeOff,
  arrowForward,
  chevronUpCircle,
  man,
  colorWand,
  personAdd,
  people,
  clipboard,
  restaurant,
  beer,
  person,
} from 'ionicons/icons';
import { LoginService } from '../../services/login-service';
import { DbService } from 'src/app/services/db-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { IUser } from 'src/app/interfaces/IUsers';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonList,
    IonText,
    IonSpinner,
    ReactiveFormsModule,
    IonFabButton,
    IonFab,
    IonFabList,
  ],
})
export class LoginFormComponent {
  private loginServ = inject(LoginService);
  private dbServ = inject(DbService);
  private storageServ = inject(LocalStorageService);

  router = inject(Router);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    addIcons({
      mail,
      lockClosed,
      eye,
      eyeOff,
      arrowForward,
      chevronUpCircle,
      man,
      colorWand,
      personAdd,
      people,
      clipboard,
      restaurant,
      beer,
      person,
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage(): string | null {
    if (!this.emailControl) return null;
    if (this.emailControl.hasError('required')) {
      return 'El correo es obligatorio';
    }
    if (this.emailControl.hasError('email')) {
      return 'Ingrese un correo válido';
    }
    return null;
  }

  getPasswordErrorMessage(): string | null {
    if (!this.passwordControl) return null;
    if (this.passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria';
    }
    if (this.passwordControl.hasError('minlength')) {
      return 'Mínimo 6 caracteres';
    }
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const { email, password } = this.loginForm.value;
      const response = await this.loginServ.initSession(email!, password!);
      if (response.error) {
        this.errorMessage = 'Error al iniciar sesión';
      } else {
        const response = await this.dbServ.getOneByEmail('usuarios', email!);
        await this.storageServ.saveData('perfil', response.data.perfil);
        await this.storageServ.saveData('user', response.data!);
        console.log('guardado en el local storage exitoso');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally {
      this.isLoading = false;
    }
  }

  toRegister() {
    this.router.navigate(['/register']);
  }

  autocompleteDuenio() {
    this.email.setValue('matias123@gmail.com');
    this.password.setValue('12345678');
  }

  autocompleteSupervisor() {
    this.email.setValue('pablo123@gmail.com');
    this.password.setValue('12345678');
  }

  autocompleteMetre() {
    this.email.setValue('miguel123@gmail.com');
    this.password.setValue('12345678');
  }

  autocompleteMozo() {
    this.email.setValue('pepito@gmail.com');
    this.password.setValue('12345678');
  }

  autocompleteCocinero() {
    this.email.setValue('sofia123@gmail.com');
    this.password.setValue('12345678');
  }

  autocompleteCliente() {
    this.email.setValue('fatu123@gmail.com');
    this.password.setValue('12345678');
  }
}
