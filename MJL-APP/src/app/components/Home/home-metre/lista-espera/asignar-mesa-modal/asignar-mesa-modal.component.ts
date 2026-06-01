import { Component, Input, inject, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { restaurantOutline } from 'ionicons/icons';
import { ClienteEnEspera } from 'src/app/interfaces/ClienteEnEspera';
import { IMesa } from 'src/app/interfaces/IMesa';
import { VibrationsService } from 'src/app/services/vibrations-service';

@Component({
  selector: 'app-asignar-mesa-modal',
  templateUrl: './asignar-mesa-modal.component.html',
  styleUrls: ['./asignar-mesa-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,
    ReactiveFormsModule,
  ],
})
export class AsignarMesaModalComponent {
  @Input() clienteEsperando!: ClienteEnEspera;
  @Input() mesasDisponibles: IMesa[] = [];

  private modalCtrl = inject(ModalController);
  vibrationService= inject(VibrationsService)

  constructor() {
    addIcons({ restaurantOutline });
  }

  initials = computed(() => {
    const c = this.clienteEsperando?.cliente;
    if (!c) return '??';
    const first = c.nombres?.charAt(0)?.toUpperCase() ?? '?';
    const last = c.apellidos?.charAt(0)?.toUpperCase() ?? '';
    return first + last;
  });

  form = new FormGroup({
    numeroMesa: new FormControl<number | null>(null, [Validators.required]),
  });

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.vibrationService.vibrate();
      return;
    }
    const mesaElegida = this.mesasDisponibles.find((mesa) => mesa.numero_mesa === this.form.value.numeroMesa);
    this.modalCtrl.dismiss({ mesaElegida: mesaElegida }, 'confirm');
  }
}
