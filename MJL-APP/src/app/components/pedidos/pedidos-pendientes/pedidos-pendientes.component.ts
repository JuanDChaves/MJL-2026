import { Component, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { IPedido } from 'src/app/interfaces/IPedido';
import { SupabaseService } from 'src/app/services/supabase-service';
import { DbService } from 'src/app/services/db-service';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
    LayoutComponent]
})
export class PedidosPendientesComponent  implements ViewWillEnter {
  pedidosPendientesList = signal<IPedido[]>([]);
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }
  //ngOnInit(): void {
  //  throw new Error('Method not implemented.');
  //}

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
      this.pedidosPendientesList.set([]);
      return;
    }
    this.pedidosPendientesList.set(response.data as IPedido[]);
    console.log(response.data)
  }
}
