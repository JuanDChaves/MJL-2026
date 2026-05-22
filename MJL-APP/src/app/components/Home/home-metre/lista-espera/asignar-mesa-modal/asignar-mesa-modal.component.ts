import { Component, Input, inject } from '@angular/core';
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
  ModalController,
} from '@ionic/angular/standalone';
import { ClienteEnEspera } from 'src/app/interfaces/ClienteEnEspera';
import { IMesa } from 'src/app/interfaces/IMesa';

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
    ReactiveFormsModule,
  ],
})
export class AsignarMesaModalComponent {
  @Input() clienteEsperando!: ClienteEnEspera;
  @Input() mesasDisponibles: IMesa[] = [];

  private modalCtrl = inject(ModalController);

  form = new FormGroup({
    numeroMesa: new FormControl<number | null>(null, [Validators.required]),
  });

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const mesaElegida = this.mesasDisponibles.find((mesa) => mesa.numero_mesa === this.form.value.numeroMesa);
    this.modalCtrl.dismiss({ mesaElegida: mesaElegida }, 'confirm');
  }
}
