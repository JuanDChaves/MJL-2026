import { Component, OnInit, Input, inject } from '@angular/core';
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
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-entregar-pedido',
  templateUrl: './entregar-pedido.component.html',
  styleUrls: ['./entregar-pedido.component.scss'], // Usa el mismo SCSS que abajo
  imports: [
    IonCard,
    IonCardContent,
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    LayoutComponent,
    DatePipe,
    UpperCasePipe
  ]
})
export class EntregarPedidoComponent implements OnInit {
  toastService = inject(ToastService)

  rolEmpleado: string = 'cocinero';
  
  pedidosPreparando: any[] = [];
  pedidosResto: any[] = []; // Hechos y Entregados

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
    try {
      // Como ya guardamos el rol arriba, acá se lo mandamos al servicio
      const todosLosPedidos = await this.pedidosService.obtenerPedidosPorSector(this.rolEmpleado);
      // Preparando: Los más viejos arriba (Ascendente)
      this.pedidosPreparando = todosLosPedidos
        .filter(p => p.estado === 'preparando')
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
      // Resto (Hecho, Entregado): Los más nuevos arriba, más viejos abajo (Descendente)
      this.pedidosResto = todosLosPedidos
        .filter(p => p.estado === 'hecho' || p.estado === 'entregado')
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } catch (error) {
      await this.toastService.showError('Error al cargar los pedidos');
    }
  }

  async entregarPedido(pedido: any) {
    // Al finalizar su parte, lo pasa a 'hecho'. El mozo será quien lo vea listo.
    const {data, error } = await this.pedidosService.cambiarEstadoPedido(pedido.id, 'hecho');
    if(error){
      await this.toastService.showError('Error al entregar el pedido');
      return;
    }
    this.cargarPedidos(); 
  }
}