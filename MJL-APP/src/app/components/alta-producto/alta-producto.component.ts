import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PhotoService } from 'src/app/services/photo-service';
import { DbService } from 'src/app/services/db-service';
import { UserService } from 'src/app/services/user-service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonSpinner,
  IonList,
  IonButtons,
  IonBackButton,
  ViewWillEnter,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  camera,
  restaurant,
  documentText,
  time,
  cash,
  alertCircle,
  addCircle,
  pencil,
  save,
  imagesOutline,
} from 'ionicons/icons';
import { ToastService } from 'src/app/services/toast-service';
import { VibrationsService } from 'src/app/services/vibrations-service';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonSpinner,
    IonList,
    IonButtons,
    IonBackButton,
  ],
})
export class AltaProductoComponent implements ViewWillEnter {
  private fb = inject(FormBuilder);
  private photoService = inject(PhotoService);
  private dbService = inject(DbService<any>);
  private userService = inject(UserService);
  toastService = inject(ToastService);
  vibrationService = inject(VibrationsService);

  productoForm: FormGroup = this.fb.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/),
      ],
    ],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    tiempoElaboracion: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    precio: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      ],
    ],
  });

  fotos: (string | null)[] = [null, null, null];
  tipoProducto: 'plato' | 'bebida' = 'plato';
  cargando: boolean = false;

  constructor() {
    // Registramos los íconos visuales
    addIcons({
      camera,
      restaurant,
      documentText,
      time,
      cash,
      alertCircle,
      addCircle,
      pencil,
      save,
      imagesOutline,
    });
  }

  ionViewWillEnter() {
    const usuarioActual = this.userService.userData();
    const rolUsuario = usuarioActual?.perfil;
    this.tipoProducto = rolUsuario === 'cantinero' ? 'bebida' : 'plato';
  }

  async tomarFoto(index: number) {
    try {
      const fotoUrl = await this.photoService.takePicture();
      if (fotoUrl) {
        this.fotos[index] = fotoUrl;
      }
    } catch (error) {
      this.toastService.showError('Error al tomar la foto');
    }
  }

  async onSubmit() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.vibrationService.vibrate();
      return;
    }

    if (this.fotos.includes(null)) {
      this.toastService.showError(
        'Debes cargar obligatoriamente las 3 fotos del producto.',
      );
      return;
    }

    this.cargando = true;
    const formValues = this.productoForm.value;

    try {
      const existe = await this.dbService.verificarProductoExistente(
        formValues.nombre,
        this.tipoProducto,
      );

      if (existe) {
        this.toastService.showError(
          `Este ${this.tipoProducto} ya existe en el menú.`,
        );
        this.cargando = false;
        return;
      }

      const urlsFotos = await this.photoService.uploadProductPhotos(
        this.fotos as string[],
        formValues.nombre,
      );

      const nuevoProducto = {
        ...formValues,
        tipo: this.tipoProducto,
        fotos: urlsFotos,
        estado: 'activo',
      };

      await this.dbService.agregarProducto(nuevoProducto);
      this.productoForm.reset();
      this.fotos = [null, null, null];
    } catch (error: any) {
      this.toastService.showError('Error al cargar el producto');
    } finally {
      this.cargando = false;
    }
  }

  get errorControl() {
    return this.productoForm.controls;
  }

  async fromGallery() {
    try {
      const result = await this.photoService.chooseFromGallery();
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        this.fotos[i] = result[i].webPath!;
      }
    } catch (error) {
      this.toastService.showError('Error al seleccionar las fotos de la galeria');
    }
  }
}
