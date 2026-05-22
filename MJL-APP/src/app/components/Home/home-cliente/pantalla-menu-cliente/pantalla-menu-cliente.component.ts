import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
  inject,
  Type,
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
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  beerOutline,
  restaurantOutline,
  addOutline,
  removeOutline,
  trashOutline,
  trophyOutline,
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
    FormsModule,
    RouterLink,
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

  selectedSegment = signal('food');
  drinks = signal<IProductoMenu[]>([]);
  food = signal<IProductoMenu[]>([]);
  mesa = signal<IMesa | null>(null);

  constructor() {
    addIcons({
      gameControllerOutline,
      beerOutline,
      restaurantOutline,
      addOutline,
      removeOutline,
      trashOutline,
      trophyOutline,
    });
  }
  async ionViewWillEnter(): Promise<void> {
    await this.loadMesa();
    await this.loadProducts();
  }

  get currentProducts(): IProductoMenu[] {
    const seg = this.selectedSegment();
    if (seg === 'drinks') return this.drinks();
    if (seg === 'food') return this.food();
    return [];
  }

  total = computed(() => {
    const all = [...this.drinks(), ...this.food()];
    return all.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  });

  product_count = computed(() => {
    const all = [...this.drinks(), ...this.food()];
    return all.reduce((sum, p) => sum + p.cantidad, 0);
  });

  total_time_computed = computed(() => {
    const all = [
      ...this.drinks().filter((p) => p.cantidad > 0),
      ...this.food().filter((p) => p.cantidad > 0),
    ];
    console.log(all);
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
    const seg = this.selectedSegment();
    if (seg === 'drinks') {
      this.drinks.update((list) =>
        list.map((p) =>
          p.id === product.id ? { ...p, cantidad: newCantidad } : p,
        ),
      );
    } else if (seg === 'food') {
      this.food.update((list) =>
        list.map((p) =>
          p.id === product.id ? { ...p, cantidad: newCantidad } : p,
        ),
      );
    }
  }

  async loadProducts() {
    let drinks = await this.productService.getDrinks();
    drinks = drinks.map((p) => ({ ...p, cantidad: 0 })) as IProductoMenu[];
    let food = await this.productService.getFood();
    food = food.map((p) => ({ ...p, cantidad: 0 })) as IProductoMenu[];
    console.log(food);
    this.drinks.set(drinks);
    this.food.set(food);
  }

  async confirmOrder() {
    const orderToLoad = this.buildOrder();
    const response = await this.orderService.insertOrder(orderToLoad);
    await this.notiService.confirmacionPedidoAMozo(this.userService.userData()!);
    console.log(response);
    const order = response.data as IOrder; 
  }

  buildOrder(): IOrderToLoad {
    const productsToLoad = [
      ...this.drinks().filter((p) => p.cantidad > 0),
      ...this.food().filter((p) => p.cantidad > 0),
    ];
    return {
      id_cliente: this.userService.userData()!.id,
      nombre_cliente:
        this.userService.userData()?.nombres +
        ' ' +
        this.userService.userData()?.apellidos,
      estado: TypeOrderState.Pendiente,
      numero_mesa: this.mesa()!.numero_mesa,
      data: productsToLoad.map((p) => ({
        id_producto: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio,
        tipo: p.tipo,
        tiempo_elaboracion: p.tiempo_elaboracion,
        descripcion: p.descripcion,
      })),
    };
  }

  async loadMesa(): Promise<void> {
    const result = await this.mesaService.getByDni(
      this.userService.userData()!.dni!,
    );
    this.mesa.set(result.data);
  }
}
