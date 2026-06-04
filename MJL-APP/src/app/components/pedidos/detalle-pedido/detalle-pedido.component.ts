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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  clipboardOutline,
} from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { UserService } from 'src/app/services/user-service';
import { ToastService } from 'src/app/services/toast-service';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';

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
  order= signal<IOrder|null>(null);
  userService = inject(UserService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  manejadorJuego = inject(ManejadorJuegos);
  
  total = computed(() => {
    const products = this.order()?.data ?? [];
    const total = products.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    if(this.manejadorJuego.descuento() > 0) return total - (total * (this.manejadorJuego.descuento() / 100));
    return total;
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

  showEncuestaYPedirCuenta = computed(() => this.order()?.estado === 'recibido');
  confirmacionPedidoRecibido = computed(() => this.order()?.estado === 'entregando');

  badgeColor = computed(() => {
    const estado = this.order()?.estado;
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'preparando':
        return 'primary';
      case 'hecho':
        return 'success';
      case 'entregando':
        return 'medium';
      default:
        return 'medium';
    }
  });

  constructor() {
    addIcons({
      receiptOutline,
      beerOutline,
      restaurantOutline,
      timeOutline,
      checkmarkOutline,
      closeOutline,
      gameControllerOutline,
      walletOutline,
      clipboardOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    await this.loadOrder();
  }

  async loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
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
  
  async confirmarRecepcion(){
    const response = await this.orderService.receivedOrder(this.pedidoId());
    if(response.error){
      await this.toastService.showError(response.error?.message);
    }
    this.router.navigate(['ingreso-local-cliente']);
  }
  pedirCuenta() {
    this.router.navigate(['detalle-cuenta', this.pedidoId()]);
  }

}
