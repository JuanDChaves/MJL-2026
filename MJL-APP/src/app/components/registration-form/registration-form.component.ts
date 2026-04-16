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
import { UserService } from '../../services/user-service';
import { LoginService } from '../../services/login-service';
import { DbService } from '../../services/db-service';
import { perfilRol } from '../types/typeRol';
import { LocalStorageService } from 'src/app/services/local-storage-service';
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
export class RegistrationFormComponent {
  router = inject(Router);
  userService = inject(UserService);
  loginServ = inject(LoginService);
  storageServ = inject(LocalStorageService);
  dbService = inject(DbService);

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
    clave: new FormControl('', [Validators.required, Validators.minLength(6)]),
    perfil: new FormControl(''),
  });
  profilelist = signal<perfilUser[]>([]);

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
    this.getPerfilUser();
    if (this.userService.isLogged()) {
      const perfilControl = this.registrationForm.get('perfil');
      perfilControl?.setValidators([Validators.required]);
      perfilControl?.updateValueAndValidity();
    } else {
      const perfilControl = this.registrationForm.get('perfil');
      perfilControl?.clearValidators();
      perfilControl?.updateValueAndValidity();
    }
  }

  async getPerfilUser() {
    let user = this.userService.userData();
    
    // Si el signal está vacío, cargar directamente desde storage
    if (!user) {
      user = await this.storageServ.getData<IUser>('user');
    }
    
    if (user) {
      if (user.perfil === 'duenio' || user.perfil === 'supervisor') {
        this.profilelist.set([
          { value: 'metre', label: 'Metre', icon: 'clipboard' },
          { value: 'mozo', label: 'Mozo', icon: 'restaurant' },
          { value: 'cocinero', label: 'Cocinero', icon: 'beer' },
          { value: 'cantinero', label: 'Cantinero', icon: 'beer' },
        ]);
        if (user.perfil === 'duenio') {
          this.profilelist.update((current) => [
            { value: 'supervisor', label: 'Supervisor', icon: 'people' },
            ...current,
          ]);
        }
      } else if (user.perfil === 'metre') {
        this.profilelist.set([
          { value: 'cliente', label: 'Cliente', icon: 'person' },
        ]);
      }
    }
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
    this.profilePhotoUrl.set(
      'foto de la camara'
    );
  }

  removePhoto() {
    this.profilePhotoUrl.set(null);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      console.log('campos del form invalidos');
      return;
    }

    this.isSubmitting.set(true);

    console.log('Formulario de registro:', this.registrationForm.value);

    // 1. Crear usuario en Supabase Auth
    const responseAuth = await this.loginServ.createAccount(
      this.registrationForm.value.correoElectronico!,
      this.registrationForm.value.clave!
    );

    if (responseAuth.error) {
      if (responseAuth.error.code == 'user_already_exists') {
        console.log('El usuario ya existe');
        this.isSubmitting.set(false);
        return;
      }
    }

    // 2. Obtener el user_id del usuario creado
    const userId = responseAuth.data?.user?.id;
    
    if (!userId) {
      console.log('Error al obtener user_id', responseAuth);
      this.isSubmitting.set(false);
      return;
    }

    if(!this.userService.isLogged()) {
      this.registrationForm.value.perfil = 'cliente';
    }

    // 3. Guardar datos en tabla usuarios
    const { error: insertError } = await this.dbService
      .insert('usuarios',{
        user_id: userId,
        apellidos: this.registrationForm.value.apellidos,
        nombres: this.registrationForm.value.nombres,
        identificacion: this.registrationForm.value.numeroDocumento,
        correo_electronico: this.registrationForm.value.correoElectronico,
        perfil: this.registrationForm.value.perfil,
        activo: false,
        url_foto_perfil: this.profilePhotoUrl()
      })
    if (insertError) {
      console.log('Error al guardar en usuarios:', insertError);
    } else {
      console.log('Usuario guardado correctamente en tabla usuarios');
    }

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/login']);
    }, 1500);
  }
}