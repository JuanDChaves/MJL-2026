import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EncuestasService } from 'src/app/services/encuestas.service';

import { 
  IonContent, IonIcon, IonButton, IonLabel, 
  IonRadioGroup, IonItem, IonRadio, IonText, 
  IonRange, IonTextarea 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { star, starOutline, sadOutline, happyOutline, checkmarkCircle } from 'ionicons/icons';
import { VibrationsService } from 'src/app/services/vibrations-service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent, IonIcon, IonButton, IonLabel, 
    IonRadioGroup, IonItem, IonRadio, IonText, 
    IonRange, IonTextarea
  ]
})
export class EncuestaComponent implements OnInit {
  vibrationService = inject(VibrationsService);
  toastService = inject(ToastService);
  encuestaForm: FormGroup;
  estrellas = [1, 2, 3, 4, 5];
  ratingComida = 0; 
  
  encuestaYaRealizada = false;
  cargando = true; 

  // ID de prueba del cliente (luego lo reemplazarás por el del usuario logueado)
  idClienteActual = 'ee7f69d8-9d75-46e4-8f53-a36c9a569895'; 
  
  // NUEVO: Variable para guardar el ID de la visita actual
  idEstadiaActual = ''; 

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private router: Router
  ) {
    addIcons({ star, starOutline, sadOutline, happyOutline, checkmarkCircle });

    this.encuestaForm = this.fb.group({
      satisfaccion_comida: ['', Validators.required],
      satisfaccion_bebida: ['', Validators.required],
      satisfaccion_atencion: [5, Validators.required], 
      comentarios: ['']
    });
  }

  async ngOnInit() {
    this.cargando = true;
    
    // 1. Recuperamos el ID de estadía generado cuando el cliente escaneó el QR en la puerta
    this.idEstadiaActual = localStorage.getItem('id_estadia') || '';

    // PLAN B: Si por algún motivo no hay estadía (ej: entró directo a la ruta), le creamos una
    if (!this.idEstadiaActual) {
      this.idEstadiaActual = crypto.randomUUID();
      localStorage.setItem('id_estadia', this.idEstadiaActual);
    }

    console.log("ID de Estadía actual:", this.idEstadiaActual); 
    
    // 2. Verificamos contra la BASE DE DATOS usando el ID DE ESTADÍA, no solo el del cliente
    this.encuestaYaRealizada = await this.encuestasService.verificarEncuestaPrevia(this.idEstadiaActual);
    
    this.cargando = false;
  }

  setRatingComida(valor: number) {
    this.ratingComida = valor;
    this.encuestaForm.patchValue({ satisfaccion_comida: valor });
  }

  async enviarEncuesta() {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      await this.vibrationService.vibrate();
      return; 
    }

    this.cargando = true; 

    try {
      const valores = this.encuestaForm.value;
      const nuevaEncuesta = {
        id_cliente: this.idClienteActual,
        id_estadia: this.idEstadiaActual, // NUEVO: Vinculamos la encuesta a esta visita específica
        numero_mesa: 5, 
        ...valores
      };

      await this.encuestasService.guardarEncuesta(nuevaEncuesta);

      this.encuestaYaRealizada = true; 
    } catch (error) {
      await this.toastService.showError('Hubo un problema al enviar la encuesta');
    } finally {
      this.cargando = false;
    }
  }

  volver() {
    this.router.navigate(['/ingreso-local-cliente']);
  }
}