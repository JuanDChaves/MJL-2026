import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  grid,
  people,
  restaurant,
  camera,
  checkmark,
} from 'ionicons/icons';
import { LayoutComponent } from '../../components/layout/layout.component';
import { ErrorMessagePipe } from '../../pipes/error-message.pipe';

@Component({
  selector: 'app-agregar-mesa-form',
  templateUrl: './agregar-mesa-form.component.html',
  styleUrls: ['./agregar-mesa-form.component.scss'],
  imports: [IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonText,
    ReactiveFormsModule,
    LayoutComponent,
    ErrorMessagePipe,],
})
export class AgregarMesaFormComponent {
 photoPreview: string | null = null;

  form = new FormGroup({
    numeroMesa: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
    cantidadComensales: new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)]),
    tipoMesa: new FormControl('', [Validators.required]),
  });

  tiposMesa = [
    { value: 'Estandar', label: 'Estandar' },
    { value: 'vip', label: 'VIP' },
    { value: 'Comensales con movilidad reducidad', label: 'Movilidad Reducida' },
  ];

  constructor() {
    addIcons({ grid, people, restaurant, camera, checkmark });
  }

  get f() {
    return this.form.controls;
  }

  tomarFoto() {
    // TODO: implementar lógica de cámara
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: implementar lógica de guardado
  }

}
