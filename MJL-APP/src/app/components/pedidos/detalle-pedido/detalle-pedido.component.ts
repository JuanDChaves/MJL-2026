import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal, WritableSignal, Input } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService } from 'src/app/services/orders-service';
import { IOrder } from 'src/app/interfaces/IOrder';
import { addIcons } from 'ionicons';
import {
  receiptOutline,
  beerOutline,
  restaurantOutline,
  timeOutline,
  checkmarkOutline,
  closeOutline,
  gameControllerOutline,
  qrCodeOutline,
  walletOutline,
} from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { UserService } from 'src/app/services/user-service';

register();

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonBadge,
    IonIcon,
    LayoutComponent,
    RouterLink,
  ],
})
export class DetallePedidoComponent implements ViewWillEnter {
  orderService = inject(OrdersService);
  localStorageService = inject(LocalStorageService);
  @Input() pedidoId: WritableSignal<string> = signal('');
  order = signal<IOrder|null>(null);
  userService = inject(UserService);
  
  // --- NUEVA SEÑAL: Identificamos si es Cliente, Mozo, etc. ---
  perfilActual = computed(() => this.userService.userData()?.perfil?.toLowerCase());

  total = computed(() => {
    const products = this.order()?.data ?? [];
    return products.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  });

  totalItems = computed(() => {
    const products = this.order()?.data ?? [];
    return products.reduce((sum, p) => sum + p.cantidad, 0);
  });

  totalTime = computed(() => {
    const products = this.order()?.data?.filter((p) => p.cantidad > 0) ?? [];
    if (products.length === 0) return 0;
    if (products.length === 1) return products[0].tiempo_elaboracion;
    return Math.trunc(
      products.reduce(
        (sum, p) => sum + p.tiempo_elaboracion * p.cantidad,
        0,
      ) / 2,
    );
  });

  isRegisteredClient = computed(() => this.userService.userData()?.dni !== null); 

  // --- MODIFICADO: Solo se muestran si el estado ya pasó a 'recibido' ---
  // Forzamos el toLowerCase() acá
  showJuegosBtn = computed(() => this.isRegisteredClient() && this.order()?.estado?.toLowerCase() === 'recibido');
  
  showEncuestaYPedirCuenta = computed(() => this.order()?.estado?.toLowerCase() === 'recibido');

  badgeColor = computed(() => {
    const estado = this.order()?.estado?.toLowerCase(); // Forzamos minúscula acá también
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'preparando': return 'primary';
      case 'hecho': return 'success';
      case 'entregado': return 'medium';
      case 'recibido': return 'tertiary';
      default: return 'medium';
    }
  });

  constructor(private route: ActivatedRoute) {
    addIcons({
      receiptOutline,
      beerOutline,
      restaurantOutline,
      timeOutline,
      checkmarkOutline,
      closeOutline,
      gameControllerOutline,
      qrCodeOutline,
      walletOutline,
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    await this.loadOrder();
  }

  async loadOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.pedidoId.set(id);
    const response = await this.orderService.getOneOrder(id);
    if (!response.success) {
      console.log(response.error?.message);
      return;
    }
    if (response.data === null) {
      console.log('No se encontro el pedido');
      return;
    }
    const data = response.data;
    this.order.set(data);
  }  

  // --- NUEVO MÉTODO PARA EL PUNTO 19 ---
  async confirmarRecepcion() {
    const pedidoActual = this.order(); 
    if (pedidoActual && pedidoActual.id) {
      const response = await this.orderService.receiveOrder(pedidoActual);
      if (response.success) {
        console.log('Pedido confirmado por el cliente');
        // Recargamos el pedido para que la pantalla detecte el estado 'recibido'
        await this.loadOrder(); 
      }
    }
  }
}