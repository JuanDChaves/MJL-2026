import { Component, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { EstadoPedido, IPedido } from 'src/app/interfaces/IPedido';
import { SupabaseService } from 'src/app/services/supabase-service';
import { DbService } from 'src/app/services/db-service';

@Component({
  selector: 'app-pedidos-en-preparacion',
  templateUrl: './pedidos-en-preparacion.component.html',
  styleUrls: ['./pedidos-en-preparacion.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe, 
    LayoutComponent
  ]
})

export class PedidosEnPreparacionComponent  implements ViewWillEnter {
  pedidosEnPreparacionList = signal<IPedido[]>([]);
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidos();
  }

  aprobarPedido() {
    console.log("aprobar")
  }

  rechazarPedido() {
    console.log("rechazar")
  }

  async getPedidos(): Promise<{ data: any | null; error: any }> {
    const response = await this.dbService.getAll('pedidos');
    if (response.error) {
      console.log(response.error);
      return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
  }

  private async cargarPedidos() {
  const response = await this.getPedidos();
    if (response.error) {
      this.pedidosEnPreparacionList.set([]);
      return;
    }
    const pedidos = response.data as IPedido[];

    this.pedidosEnPreparacionList.set(
      pedidos.filter(pedido => pedido.estado === 'preparando')
    );
    console.log(response.data)
  }
}

