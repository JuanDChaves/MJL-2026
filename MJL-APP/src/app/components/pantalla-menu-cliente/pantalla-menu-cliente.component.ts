import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, signal, inject } from '@angular/core';
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
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  beerOutline,
  restaurantOutline,
  addOutline,
  removeOutline,
  trashOutline,
} from 'ionicons/icons';
import { ProductsService } from 'src/app/services/products-service';
import { register } from 'swiper/element/bundle';

register();

interface ProductoMenu {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_elaboracion: number;
  tipo: 'plato' | 'bebida';
  fotos: string[];
  cantidad: number;
}

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PantallaMenuClienteComponent implements ViewWillEnter {

  productService = inject(ProductsService);

  selectedSegment = signal('food');

  drinks = signal<ProductoMenu[]>([]);

  food = signal<ProductoMenu[]>([]);

  constructor() {
    addIcons({
      gameControllerOutline,
      beerOutline,
      restaurantOutline,
      addOutline,
      removeOutline,
      trashOutline,
    });
  }
  ionViewWillEnter(): void {
    this.loadProducts();
  }

  get currentProducts(): ProductoMenu[] {
    const seg = this.selectedSegment();
    if (seg === 'drinks') return this.drinks();
    if (seg === 'food') return this.food();
    return [];
  }

  total = computed(() => {
    const all = [...this.drinks(), ...this.food()];
    return all.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  });

  addOne(product: ProductoMenu) {
    this.updateProduct(product, product.cantidad + 1);
  }

  removeOne(product: ProductoMenu) {
    if (product.cantidad > 0) {
      this.updateProduct(product, product.cantidad - 1);
    }
  }

  deleteItem(product: ProductoMenu) {
    this.updateProduct(product, 0);
  }

  private updateProduct(product: ProductoMenu, newCantidad: number) {
    const seg = this.selectedSegment();
    if (seg === 'drinks') {
      this.drinks.update((list) =>
        list.map((p) => (p.id === product.id ? { ...p, cantidad: newCantidad } : p))
      );
    } else if (seg === 'food') {
      this.food.update((list) =>
        list.map((p) => (p.id === product.id ? { ...p, cantidad: newCantidad } : p))
      );
    }
  }

  async loadProducts(){
    let drinks = await this.productService.getDrinks();
    drinks = drinks.map((p) => ({ ...p, cantidad: 0 })) as ProductoMenu[];
    let food = await this.productService.getFood();
    food = food.map((p) => ({ ...p, cantidad: 0 })) as ProductoMenu[];
    console.log(food);
    this.drinks.set(drinks);
    this.food.set(food);
  }
}