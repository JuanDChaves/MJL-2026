import { Component, computed, OnInit, signal } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

interface OpcionPropina {
  nombre: string;
  porcentaje: number;
  descripcion: string;
  icono: string;
  colorClass: string;
}

@Component({
  selector: 'app-seleccionar-propina',
  templateUrl: './seleccionar-propina.component.html',
  styleUrls: ['./seleccionar-propina.component.scss'],
  imports: [LayoutComponent, CommonModule, IonButton],
})
export class SeleccionarPropinaComponent implements OnInit {
  opciones: OpcionPropina[] = [
    {
      nombre: 'Excelente',
      porcentaje: 20,
      icono: '✨',
      colorClass: 'excelente',
      descripcion:
        'Total conformidad con el estado de su plato, la atención del personal y la experiencia con la aplicación.',
    },
    {
      nombre: 'Muy Bueno',
      porcentaje: 15,
      icono: '🙂',
      colorClass: 'muy-bueno',
      descripcion:
        'Muy buena experiencia general. Pequeños detalles que no afectaron la satisfacción.',
    },
    {
      nombre: 'Bueno',
      porcentaje: 10,
      icono: '👍',
      colorClass: 'bueno',
      descripcion: 'Buena experiencia general, sin quejas significativas.',
    },
    {
      nombre: 'Regular',
      porcentaje: 5,
      icono: '😐',
      colorClass: 'regular',
      descripcion:
        'Experiencia aceptable con margen de mejora en algunos aspectos.',
    },
    {
      nombre: 'Malo',
      porcentaje: 0,
      icono: '😞',
      colorClass: 'malo',
      descripcion:
        'Experiencia insatisfactoria. Mejoras necesarias en varios aspectos.',
    },
  ];

  opcionSeleccionada = signal<OpcionPropina | null>(null);

  descuento = computed(() => {
    const op = this.opcionSeleccionada();
    const pct = op?.porcentaje ?? 0;
    const result = (100 - pct) / 100;
    return result;
  });

  constructor() {}

  ngOnInit() {}

  seleccionar(opcion: OpcionPropina): void {
    this.opcionSeleccionada.set(opcion);
  }

  confirmar(): void {
    /**
     * LU ACA REDIRIGIS A LA PANTALLA DE PAGO CON DETALLE DEL PEDIDO Y EL CALCULO DE LA PROPINA ETC PUNTO 21.
     */
    if (this.opcionSeleccionada()) {
      console.log('Propina elegida:', this.opcionSeleccionada());
    }
  }
}
