import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';
import { TipService } from 'src/app/services/tip-service';

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
export class SeleccionarPropinaComponent {
  
  opcionSeleccionada = signal<OpcionPropina | null>(null);
  activateRoute = inject(ActivatedRoute);
  idOrder = this.activateRoute.snapshot.paramMap.get('idOrder');
  toastService = inject(ToastService);
  router = inject(Router);
  tipService = inject(TipService);

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
  
  propina = computed(() => {
    const op = this.opcionSeleccionada();
    return op;
  });

  seleccionar(opcion: OpcionPropina): void {
    this.opcionSeleccionada.set(opcion);
  }

  confirmar(): void {
    if (this.opcionSeleccionada()) {
      this.tipService.setTip(this.opcionSeleccionada()!.porcentaje);
      this.router.navigate(['/detalle-cuenta', this.idOrder]);
    }else{
      this.toastService.showError('Debe seleccionar una propina antes de confirmar');
    }
  }
}
