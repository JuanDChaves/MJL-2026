import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, IonBadge, ViewWillEnter } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { EstadoPedido, IPedido } from 'src/app/interfaces/IPedido';
import { SupabaseService } from 'src/app/services/supabase-service';
import { DbService } from 'src/app/services/db-service';
import { PedidosService } from 'src/app/services/pedidos-service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPedidoConProductos } from 'src/app/interfaces/IProductoPedido';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonBadge,
    IonIcon,
    DatePipe,
    LayoutComponent
  ]
})
export class DetallePedidoComponent  implements ViewWillEnter {
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);
  pedidosService = inject(PedidosService);
  pedidoId: WritableSignal<string> = signal("");
  pedido: WritableSignal<IPedidoConProductos | null> = signal(null);

  constructor(private route: ActivatedRoute) { }

  async ionViewWillEnter(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) return;

    this.pedidoId.set(id);
    const data = await this.pedidosService.cargarPedidoConProductos(id);
    this.pedido.set(data);
    console.log(this.pedidoId())
  }

}
