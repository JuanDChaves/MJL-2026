import { Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonText,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { PhotoService } from 'src/app/services/photo-service';
import { UserService } from 'src/app/services/user-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { ErrorMessagePipe } from 'src/app/pipes/error-message.pipe';
import { ClientService } from 'src/app/services/client-service';
import { IUserToRegister } from 'src/app/interfaces/IUserToRegister';

@Component({
  selector: 'app-anonymous-user-registration-form',
  templateUrl: './anonymous-user-registration-form.component.html',
  styleUrls: ['./anonymous-user-registration-form.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonText,
    IonSpinner,
    ReactiveFormsModule,
    ErrorMessagePipe,
  ],
})
export class AnonymousUserRegistrationFormComponent {
  photoService = inject(PhotoService);
  localStorage = inject(LocalStorageService);
  clientService = inject(ClientService);
  userService = inject(UserService);
  viewProfilePhoto = signal<string | null>(null);
  modalCtrl = inject(ModalController);

  errorMessage: string | null = null;
  isSubmitting = signal(false);

  nombres = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/),
  ]);
  profileImage = new FormControl(null, [Validators.required]);

  formModal = new FormGroup({
    nombres: this.nombres,
    profileImage: this.profileImage,
  });

  async onSelectPhoto() {
    const path = await this.photoService.takePicture();
    if (path === null) {
      console.log('error al obtener el path de la foto');
      return;
    }
    this.viewProfilePhoto.set(path!);
    const blob = await this.photoService.getPhotoBlob(path);
    const urlPublic = await this.photoService.uploadProfilePhoto(
      blob,
      `anonimo-${Date.now()}`,
    );
    this.formModal.patchValue({
      profileImage: urlPublic as any,
    });
  }
  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    if (this.formModal.invalid || !this.viewProfilePhoto()) {
      this.formModal.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage = null;

    const userAnon: IUserToRegister = {
      activo: true,
      nombres: this.formModal.controls.nombres.value!,
      perfil: 'cliente',
      url_foto_perfil: this.formModal.controls.profileImage.value,
      apellidos: null,
      correo_electronico: null,
      cuil: null,
      dni: null,
      user_id: null,
    };

    const result = await this.userService.insert(userAnon);
    if (result.success) {
      this.localStorage.saveData('user', result.data!);
    }else{
      this.isSubmitting.set(false);
      this.errorMessage = result.error?.message!;
    }
    this.modalCtrl.dismiss({ user: result.data  }, result.success ? 'confirm' : 'cancel');
  }

  get f() {
    return this.formModal.controls;
  }
}
