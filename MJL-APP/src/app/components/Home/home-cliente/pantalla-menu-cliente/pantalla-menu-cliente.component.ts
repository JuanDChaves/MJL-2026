import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonFooter,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router'; // <-- Agregado RouterLink
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  beerOutline,
  restaurantOutline,
  addOutline,
  removeOutline,
  trashOutline,
  trophyOutline,
  pieChartOutline,
  chatbubblesOutline,
  checkmarkDoneCircleOutline, // <-- Nuevo
  cashOutline,                // <-- Nuevo
  timeOutline,                // <-- Nuevo
  clipboardOutline            // <-- Nuevo
} from 'ionicons/icons';
import { IMesa } from 'src/app/interfaces/IMesa';
import { IOrder } from 'src/app/interfaces/IOrder';
import { IOrderToLoad } from 'src/app/interfaces/IOrderToLoad';
import { IProductoMenu } from 'src/app/interfaces/IProductoMenu';
import { MesaService } from 'src/app/services/mesa-service';
import { OrdersService } from 'src/app/services/orders-service';
import { ProductsOrdersService } from 'src/app/services/products-orders-service';
import { ProductsService } from 'src/app/services/products-service';
import { UserService } from 'src/app/services/user-service';
import { register } from 'swiper/element/bundle';
import { TypeOrderState } from 'src/app/types/TypeOrderState';
import { NotificationsService } from 'src/app/services/notifications-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { IResult } from 'src/app/interfaces/IResult';
import { UpperCasePipe } from '@angular/common';

register();

@Component({
  selector: 'app-pantalla-menu-cliente',
  templateUrl: './pantalla-menu-cliente.component.html',
  styleUrls: ['./pantalla-menu-cliente.component.scss'],
  imports: [
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonButton,
    IonFooter,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    FormsModule,
    RouterLink, // <-- Necesario para los routerLink del HTML
    UpperCasePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PantallaMenuClienteComponent implements ViewWillEnter {
  productService = inject(ProductsService);
  userService = inject(UserService);
  mesaService = inject(MesaService);
  orderService = inject(OrdersService);
  productOrderService = inject(ProductsOrdersService);
  notiService = inject(NotificationsService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);

  drinks = signal<IProductoMenu[]>([]);
  food = signal<IProductoMenu[]>([]);

  mesa = signal<IMesa | null>(null);
  currentProducts = signal<IProductoMenu[]>([]);
  segSelected = signal<string>('food');

  // --- NUEVA SEÑAL PARA EL ESTADO DEL PEDIDO ---
  miPedidoActivo = signal<IOrder | null>(null);

  constructor() {
    addIcons({
      gameControllerOutline,
      beerOutline,
      restaurantOutline,
      addOutline,
      removeOutline,
      trashOutline,
      trophyOutline,
      pieChartOutline,
      chatbubblesOutline,
      checkmarkDoneCircleOutline,
      cashOutline,
      timeOutline,
      clipboardOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    await this.loadMesa();
    
    // 1. Buscamos si ya hay un pedido activo para esta mesa
    await this.loadActiveOrderFromDB();
    
    // 2. Si no hay pedido o se está editando recién, cargamos los productos
    if (!this.miPedidoActivo() || this.miPedidoActivo()?.estado === 'editando') {
      await this.loadProductsInit();
    }
  }

  // --- MÉTODOS NUEVOS PARA EL FLUJO DE ESTADOS (Punto 19) ---

  async loadActiveOrderFromDB() {
    const result = await this.checkExistOrder();
    if (result.success && result.data) {
      // Ignoramos pedidos ya pagados o finalizados para que puedan pedir de nuevo si quieren
      if (result.data.estado !== 'pagado' && result.data.estado !== 'finalizado') {
        this.miPedidoActivo.set(result.data);
      }
    }
  }

  async confirmarRecepcion() {
    const pedido = this.miPedidoActivo();
    if (pedido && pedido.id) {
      // Pasamos el pedido a estado RECIBIDO
      const response = await this.orderService.receiveOrder(pedido); 
      if (response.success) {
        await this.loadActiveOrderFromDB(); // Recargamos para que aparezcan los juegos
      }
    }
  }

  async pedirCuenta() {
    const pedido = this.miPedidoActivo();
    if (pedido) {
      // Acá redirigís a la pantalla de propinas o pagos
      console.log('Solicitando cuenta...');
      // this.router.navigate(['/pagos']); 
    }
  }

  // --- MÉTODOS DE TU COMPAÑERO Y DEL CARRITO (INFERIORES) ---

  changeSegment(segProduct: string) {
    this.segSelected.set(segProduct);
    if (segProduct === 'drinks') {
      this.currentProducts.set(this.drinks());
      return;
    }
    this.currentProducts.set(this.food());
    return;
  }

  total = computed(() => {
    let all: IProductoMenu[] = this.cart;
    return all.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  });

  product_count = computed(() => {
    let all: IProductoMenu[] = this.cart;
    return all.reduce((sum, p) => sum + p.cantidad, 0);
  });

  total_time_computed = computed(() => {
    let all: IProductoMenu[] = this.cart;
    if (this.product_count() === 0) return 0;
    if (this.product_count() === 1) return all[0].tiempo_elaboracion;
    return Math.trunc(
      all.reduce((sum, p) => sum + p.tiempo_elaboracion * p.cantidad, 0) / 2,
    );
  });

  addOne(product: IProductoMenu) {
    this.updateProduct(product, product.cantidad + 1);
  }

  removeOne(product: IProductoMenu) {
    if (product.cantidad > 0) {
      this.updateProduct(product, product.cantidad - 1);
    }
  }

  deleteItem(product: IProductoMenu) {
    this.updateProduct(product, 0);
  }

  private updateProduct(product: IProductoMenu, newCantidad: number) {
    const updateFn = (list: IProductoMenu[]) =>
      list.map((p) =>
        p.id === product.id ? { ...p, cantidad: newCantidad } : p,
      );
    this.currentProducts.update(updateFn);
    if(this.segSelected() === 'drinks'){
      this.drinks.update(updateFn);
    }else{
      this.food.update(updateFn);
    }
  }

  async checkExistOrder(): Promise<IResult<IOrder>> {
    const result: IResult<IOrder> = {
      success: false,
      data: null,
      error: null,
    };
    const order_id = await this.localStorageService.getData<{ id: string }>(
      'id_pedido',
    );
    if (!order_id?.id) {
      result.error = { message: 'No hay pedido cargado' };
      return result;
    }
    const resultOrder = await this.orderService.getOneOrder(order_id!.id);
    if (!resultOrder.success) {
      result.error = { message: 'Error al obtener el pedido' };
      return result;
    }
    result.data = resultOrder.data;
    result.success = true;
    return result;
  }

  async loadOrderPreview() {
    const productos_pedidos =
      await this.localStorageService.getData<IProductoMenu[]>(
        'productos_pedido',
      );
    this.drinks.set([...productos_pedidos!.filter((p) => p.tipo === 'bebida')]);
    this.food.set([...productos_pedidos!.filter((p) => p.tipo === 'plato')]);
    if(this.segSelected() === 'drinks') this.currentProducts.set(this.drinks());
    else this.currentProducts.set(this.food());
  }

  async loadProductsInit() {
    const result = await this.checkExistOrder();
    if (result.success && result.data?.estado === 'editando') {
      await this.loadOrderPreview();
      return;
    }
    let drinks = await this.productService.getDrinks();
    drinks = drinks.map((p) => ({ ...p, cantidad: 0 })) as IProductoMenu[];

    let food = await this.productService.getFood();
    food = food.map((p) => ({ ...p, cantidad: 0 })) as IProductoMenu[];

    this.drinks.set(drinks);
    this.food.set(food);

    this.currentProducts.set(
      this.segSelected() === 'drinks' ? this.drinks() : this.food(),
    );
  }

  async confirmOrder() {
    const orderToLoad = this.buildOrder();

    if (!orderToLoad.success) {
      return orderToLoad.error?.message;
    }
    const response = await this.orderService.insertOrder(orderToLoad.data!);
    if (!response.success) {
      return response.error?.message;
    }

    // --- CORRECCIÓN DEL ID AL CREAR EL PEDIDO ---
    const datosInsertados = response.data as any;
    const orderId = Array.isArray(datosInsertados) ? datosInsertados[0].id : datosInsertados.id;

    await this.localStorageService.saveData('productos_pedido', this.cart);
    
    // Guardamos el ID correcto en el storage
    await this.localStorageService.saveData('id_pedido', { id: orderId });

    await this.notiService.confirmacionPedidoAMozo(
      this.userService.userData()!,
    );
    console.log('Pedido guardado correctamente:', orderId);
    
    // Redireccionamos obligando a que vuelva a escanear
    this.router.navigate(['/ingreso-local-cliente']);
    return;
  }

  buildOrder(): IResult<IOrderToLoad> {
    const result: IResult<IOrderToLoad> = {
      success: false,
      data: null,
      error: null,
    };

    if(this.product_count() === 0) {
      result.error = { message: 'No hay productos en el pedido' };
      return result;
    };
    let all: IProductoMenu[] = this.cart.filter((p) => p.cantidad > 0);
    if (all.length === 0) {
      result.error = { message: 'No hay productos en el pedido' };
      return result;
    }
    result.success = true;
    result.data = {
      id_cliente: this.userService.userData()!.id,
      nombre_cliente:
        this.userService.userData()?.nombres!,
      estado: TypeOrderState.Pendiente,
      numero_mesa: this.mesa()!.numero_mesa,
      data: all.map((p) => ({
        id_producto: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio,
        tipo: p.tipo,
        tiempo_elaboracion: p.tiempo_elaboracion,
        descripcion: p.descripcion,
      })),
    };
    return result;
  }

  openChat() {
    const mesaId = this.mesa()?.id;
    if (mesaId) {
      this.router.navigate(['/chat', mesaId]);
    }
  }

  async loadMesa(): Promise<void> {
    const result = await this.mesaService.getByIdUser(
      this.userService.userData()!.id!,
    );
    this.mesa.set(result.data);
  }

  get cart() {
    let all: IProductoMenu[] = [...this.currentProducts()];
    if (this.segSelected() === 'drinks') {
      this.food().forEach((f) => all.push(f));
    } else {
      this.drinks().forEach((d) => all.push(d));
    }
    return all;
  }
}