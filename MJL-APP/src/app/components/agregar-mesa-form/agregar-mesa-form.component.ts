import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { IonItem, IonIcon, IonInput, IonButton, IonSelect, IonSelectOption, IonText, ViewWillEnter, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, people, restaurant, camera, checkmark } from 'ionicons/icons';
import { LayoutComponent } from '../../components/layout/layout.component';
import { ErrorMessagePipe } from '../../pipes/error-message.pipe';
import { PhotoService } from 'src/app/services/photo-service';

@Component({
  selector: 'app-agregar-mesa-form',
  templateUrl: './agregar-mesa-form.component.html',
  styleUrls: ['./agregar-mesa-form.component.scss'],
  imports: [
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonText,
    ReactiveFormsModule,
    LayoutComponent,
    ErrorMessagePipe,
    IonSpinner
],
})
export class AgregarMesaFormComponent implements ViewWillEnter {
  photoPreview: string | null = null;
  photoService = inject(PhotoService);
  isSubmitting = signal(false);
  errorMessage: string | null = null;

  form = new FormGroup({
    numeroMesa: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    cantidadComensales: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    tipoMesa: new FormControl('', [Validators.required]),
  });

  tiposMesa = [
    { value: 'Estandar', label: 'Estandar' },
    { value: 'vip', label: 'VIP' },
    {
      value: 'Comensales con movilidad reducidad',
      label: 'Movilidad Reducida',
    },
  ];

  constructor() {
    addIcons({ grid, people, restaurant, camera, checkmark });
  }
  ionViewWillEnter(): void {
    this.form.reset();
    this.errorMessage = null;
    this.photoPreview = null;
  }

  get f() {
    return this.form.controls;
  }

  async tomarFoto() {
    try {
      const fotoUrl = await this.photoService.takePicture();
      if (fotoUrl) {
        this.photoPreview = fotoUrl;
        this.errorMessage = null;
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  onSubmit() {
    if(this.photoPreview === null) {
      this.errorMessage = 'Por favor, agrega una foto de la mesa';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: implementar lógica de guardado
  }
}
