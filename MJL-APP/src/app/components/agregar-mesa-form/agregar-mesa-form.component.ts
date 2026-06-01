import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  ViewWillEnter,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, people, restaurant, camera, checkmark } from 'ionicons/icons';
import { LayoutComponent } from '../../components/layout/layout.component';
import { ErrorMessagePipe } from '../../pipes/error-message.pipe';
import { PhotoService } from 'src/app/services/photo-service';
import { TipoMesa } from 'src/app/types/TipoMesa';
import { QrService } from 'src/app/services/qr-service';
import { MesaService } from 'src/app/services/mesa-service';
import { IMesaACargar } from 'src/app/interfaces/IMesaACargar';
import { ToastService } from 'src/app/services/toast-service';
import { VibrationsService } from 'src/app/services/vibrations-service';

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
    IonSpinner,
  ],
})
export class AgregarMesaFormComponent implements ViewWillEnter {
  photoService = inject(PhotoService);
  qrService = inject(QrService);
  mesaService = inject(MesaService);
  photoPreview: string | null = null;
  isSubmitting = signal(false);
  errorMessage: string | null = null;
  toastService = inject(ToastService);
  vibrationService = inject(VibrationsService);

  form = new FormGroup({
    numeroMesa: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
    cantidadComensales: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    tipoMesa: new FormControl<TipoMesa>('estandar', [Validators.required]),
  });

  tiposMesa = [
    { value: 'estandar', label: 'Estandar' },
    { value: 'vip', label: 'VIP' },
    {
      value: 'movilidadReducida',
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
      this.toastService.showError('Error al tomar la foto');
    }
  }

  async onSubmit() {
    if (this.photoPreview === null) {
      this.errorMessage = 'Por favor, agrega una foto de la mesa';
      this.vibrationService.vibrate();
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.vibrationService.vibrate();
      return;
    }    

    const mesa:IMesaACargar ={
      numero_mesa: parseInt(this.form.value.numeroMesa!),
      tipo_mesa: this.form.value.tipoMesa!,
      cantidad_comensales: parseInt(this.form.value.cantidadComensales!),
      url_foto_mesa: this.photoPreview,
      url_qr: '',
      ocupada: false,
      user_id: null
    }

    const response = await this.mesaService.cargarMesa(mesa);
    if(!response.success){
      this.toastService.showError(response.error!.message);
      return;
    }
    this.errorMessage = null;
    
    
    console.log(response.data);
  }
}
