import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
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
export class RegistrationFormComponent {
  router = inject(Router);

  registrationForm = new FormGroup({
    apellidos: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/),
    ]),
    nombres: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/),
    ]),
    numeroDocumento: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(8),
      Validators.pattern(/^\d{7,8}$/),
    ]),
    correoElectronico: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    clave: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    perfil: new FormControl('', [Validators.required]),
  });

  perfiles = [
    { value: 'duenio', label: 'Dueño', icon: 'person' },
    { value: 'supervisor', label: 'Supervisor', icon: 'people' },
    { value: 'metre', label: 'Metre', icon: 'clipboard' },
    { value: 'mozo', label: 'Mozo', icon: 'restaurant' },
    { value: 'cocinero', label: 'Cocinero', icon: 'beer' },
    { value: 'cantinero', label: 'Cantinero', icon: 'beer' },
  ];

  showPassword = signal(false);
  profilePhotoUrl = signal<string | null>(null);
  isSubmitting = signal(false);

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

  get f() {
    return this.registrationForm.controls;
  }

  getErrorMessage(field: string): string | null {
    const control = this.registrationForm.get(field);
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
      if (field === 'numeroDocumento') {
        return 'Solo números (7-8 dígitos)';
      }
      return 'Solo letras permitidas';
    }
    return null;
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  onSelectPhoto() {
    // TODO: Implementar selección de foto
    // Por ahora simulamos una foto
    this.profilePhotoUrl.set('https://ionicframework.com/docs/img/demos/avatar.jpeg');
  }

  removePhoto() {
    this.profilePhotoUrl.set(null);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // TODO: Implementar registro
    console.log('Formulario de registro:', this.registrationForm.value);

    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 1500);
  }
}