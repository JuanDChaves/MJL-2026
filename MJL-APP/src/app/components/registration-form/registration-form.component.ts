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
  cameraReverse,
  cameraReverseOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { LoginService } from '../../services/login-service';
import { DbService } from '../../services/db-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { RegisterFormService } from 'src/app/services/register-form-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PhotoService } from 'src/app/services/photo-service';
import { BarcodeScannerService } from 'src/app/services/barcode-scanner-service';
import { ErrorMessagePipe } from 'src/app/pipes/error-message.pipe';
import { RegistrationService } from 'src/app/services/registration-service';

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
    ErrorMessagePipe,
  ],
})
export class RegistrationFormComponent implements ViewWillEnter, OnInit {
  router = inject(Router);
  userService = inject(UserService);
  loginServ = inject(LoginService);
  storageServ = inject(LocalStorageService);
  dbService = inject(DbService);
  formService = inject(RegisterFormService);
  photoService = inject(PhotoService);
  scannerService = inject(BarcodeScannerService);
  registrationService = inject(RegistrationService);

  form = toSignal(this.formService.form$, {
    initialValue: this.formService.registerForm,
  });
  profilelist = toSignal(this.formService.profileList$, { initialValue: [] });

  showPassword = signal(false);
  viewProfilePhoto = signal<string | null>(null);
  profilePhotoUrl = signal<string | null>(null);
  isSubmitting = signal(false);

  errorMessage: string | null = null;

  constructor() {}

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
      cameraReverseOutline,
      restaurant,
      people,
      clipboard,
      beer,
      flash,
      qrCodeOutline,
    });
  }

  async ionViewWillEnter() {
    this.resetForm();
    await this.userService.loadUserData();
    await this.formService.buildForm();
  }

  
  resetForm() {
    this.formService.cleanForm();
    this.profilePhotoUrl.set(null);
    this.viewProfilePhoto.set(null);
    this.errorMessage = null;
  }

  get f() {
    return this.form().controls;
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  async onSelectPhoto(): Promise<void> {
    // Forzamos la apertura de la cámara (sin galería)
    const path = await this.photoService.takePicture();

    if (path) {
      this.viewProfilePhoto.set(path);
      
      // patchValue actualiza el campo de forma segura
      this.form().patchValue({
        profileImg: path as any
      });
    }
  }

  removePhoto() {
    this.viewProfilePhoto.set(null);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async onSubmit() {
    if (this.form().invalid || !this.viewProfilePhoto()) {
      this.form().markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage = null;

    try {
      const result = await this.registrationService.registerUser(
        this.form().controls
      );
      if (!result.success) {
        this.errorMessage = result.error?.message ?? 'Error desconocido';
        return;
      }
      this.resetForm();
      this.redirection();
    } catch (err: any) {
      this.errorMessage = err.message || 'Error inesperado';
    } finally {
      this.isSubmitting.set(false);
    }
  }

  redirection() {
    if (this.userService.isLogged()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async scanQr() {
    const { apellidos, nombres, dni } = await this.scannerService.scanQrDni();
    this.form().controls.nombres.setValue(nombres);
    this.form().controls.apellidos.setValue(apellidos);
    this.form().controls.dni.setValue(dni);
  }
}
