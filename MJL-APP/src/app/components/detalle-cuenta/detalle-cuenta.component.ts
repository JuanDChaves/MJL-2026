import { Component, computed, inject, signal } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { ViewWillEnter } from '@ionic/angular';
import { OrdersService } from 'src/app/services/orders-service';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import { UserService } from 'src/app/services/user-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { IOrder } from 'src/app/interfaces/IOrder';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';
import { TipService } from 'src/app/services/tip-service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonBadge,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { walletOutline, restaurantOutline, beerOutline, heartOutline } from 'ionicons/icons';
import { NotificationsService } from 'src/app/services/notifications-service';
import { BarcodeScannerService } from 'src/app/services/barcode-scanner-service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.component.html',
  styleUrls: ['./detalle-cuenta.component.scss'],
  imports: [
    LayoutComponent,
    IonIcon,
    IonBadge,
    IonAvatar,
    IonCardContent,
    IonCard,
    IonButton
],
})
export class DetalleCuentaComponent implements ViewWillEnter {
  handlerGame = inject(ManejadorJuegos);
  orderService = inject(OrdersService);
  userService = inject(UserService);
  storageService = inject(LocalStorageService);
  activateRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  router = inject(Router);
  tipService = inject(TipService);
  toastCtrl = inject(ToastController);
  notiService = inject(NotificationsService);
  scanService = inject(BarcodeScannerService);
  order = signal<IOrder | null>(null);
  tip = toSignal(this.tipService.tip$, { initialValue: 0 });

  subtotal = computed(() => {
    const products = this.order()?.data ?? [];
    const total = products.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    return total;
  });

  showDiscount = computed(() => {
    const total = this.subtotal();
    if (this.handlerGame.descuento() > 0)
      return total * (this.handlerGame.descuento() / 100);
    return 0;
  });

  showTip = computed(() => {
    const total = this.subtotal();
    if (this.tip() > 0) return total * (this.tip() / 100);
    return 0;
  });

  totalItems = computed(() => {
    const products = this.order()?.data ?? [];
    return products.reduce((sum, p) => sum + p.cantidad, 0);
  });

  total = computed(() => {
    const discount = this.showDiscount();
    const subtotal = this.subtotal();
    const tip = this.showTip();
    return subtotal - discount + tip;
  })

  constructor() {
    addIcons({
      walletOutline,
      restaurantOutline,
      beerOutline,
      heartOutline,
    });
  }

  async ionViewWillEnter() {
    await this.loadOrder();
  }

  async loadOrder() {
    let idOrder: string | null =
      this.activateRoute.snapshot.paramMap.get('idOrder');
    if (!idOrder) {
      const idOrderObject: any = this.storageService.getData('id_pedido');
      idOrder = idOrderObject.id;
    }
    if (!idOrder)
      return await this.toastService.showError('Error al cargar el pedido');

    const result = await this.orderService.getOneOrder(idOrder!);
    if (result.error) {
      return await this.toastService.showError('Error al cargar el pedido');
    }
    this.order.set(result.data);
  }

  async goToTip() {
    const scanResult = await this.scanService.scanQrGeneric();
    if(scanResult !== 'propinas') return await this.toastService.showError('Error al escanear el qr de propinas');
    this.router.navigate(['/propinas', this.order()?.id]);
  }

  async proceedToPayment() {
    const result = await this.orderService.payOrder(this.order()?.id!);
    if(result.error || !result.success) return await this.toastService.showError(result.error?.message! ?? 'Error al confirmar el pago');
    await this.notiService.realizoPago({nombres: this.order()?.nombre_cliente!, id: this.order()?.id_cliente!});
    await this.storageService.deleteData('id_pedido');
    await this.storageService.deleteData('productos_pedido');
    this.router.navigate(['/home']);
  }
}
