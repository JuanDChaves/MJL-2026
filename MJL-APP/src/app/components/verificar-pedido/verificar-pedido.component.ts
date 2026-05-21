import { Component, OnInit, Input } from '@angular/core';
import { PedidosSectoresService } from 'src/app/services/pedidos-sectores.service';
import { ActivatedRoute } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle

} from '@ionic/angular/standalone';
import { LayoutComponent } from '../layout/layout.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-verificar-pedido',
  templateUrl: './verificar-pedido.component.html',
  styleUrls: ['./verificar-pedido.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    LayoutComponent,
    DatePipe
  ]
})
export class VerificarPedidoComponent implements OnInit {
  rolEmpleado: string = 'cocinero'; 
  
  pedidosPendientes: any[] = [];
  pedidosPreparando: any[] = [];

  constructor(
    private pedidosService: PedidosSectoresService,
    private route: ActivatedRoute // 3. Lo inyectamos en el constructor
  ) {}

  ngOnInit() {
    // 4. Leemos el parámetro de la URL apenas entramos a la pantalla
    this.route.queryParams.subscribe(params => {
      if (params['rol']) {
         this.rolEmpleado = params['rol']; // Va a guardar 'cocinero' o 'cantinero'
      }
      
      // 5. ¡IMPORTANTE! Llamamos a cargarPedidos acá adentro, 
      // para asegurarnos de que ya sabemos el rol antes de ir a buscar a Supabase
      this.cargarPedidos();
    });
  }

  async cargarPedidos() {
    // Como ya guardamos el rol arriba, acá se lo mandamos al servicio
    const todosLosPedidos = await this.pedidosService.obtenerPedidosPorSector(this.rolEmpleado);
    
    // Separar y ordenar: Los más viejos arriba (Ascendente)
    this.pedidosPendientes = todosLosPedidos
      .filter(p => p.estado === 'pendiente')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    this.pedidosPreparando = todosLosPedidos
      .filter(p => p.estado === 'preparando')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  async aceptarPedido(pedido: any) {
    await this.pedidosService.cambiarEstadoPedido(pedido.id, 'preparando');
    this.cargarPedidos(); // Recargar listas
  }
}