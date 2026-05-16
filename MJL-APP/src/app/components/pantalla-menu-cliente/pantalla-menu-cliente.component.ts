import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonFooter,
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
import { register } from 'swiper/element/bundle';

register();

interface ProductoMenu {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo_estimado: number;
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
export class PantallaMenuClienteComponent {
  selectedSegment = signal('food');

  drinks = signal<ProductoMenu[]>([
    {
      id: 'd1',
      nombre: 'Agua mineral',
      descripcion: 'Agua sin gas 500ml',
      precio: 1200,
      tiempo_estimado: 2,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Agua+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Agua+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Agua+3',
      ],
      cantidad: 0,
    },
    {
      id: 'd2',
      nombre: 'Cerveza artesanal',
      descripcion: 'Cerveza rubia 330ml',
      precio: 2800,
      tiempo_estimado: 3,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Cerveza+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Cerveza+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Cerveza+3',
      ],
      cantidad: 0,
    },
    {
      id: 'd3',
      nombre: 'Limonada casera',
      descripcion: 'Limonada con menta y jengibre 400ml',
      precio: 1800,
      tiempo_estimado: 5,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Limonada+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Limonada+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Limonada+3',
      ],
      cantidad: 0,
    },
  ]);

  food = signal<ProductoMenu[]>([
    {
      id: 'f1',
      nombre: 'Hamburguesa clásica',
      descripcion: 'Carne 150g, lechuga, tomate, queso cheddar',
      precio: 4500,
      tiempo_estimado: 15,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Burger+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Burger+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Burger+3',
      ],
      cantidad: 0,
    },
    {
      id: 'f2',
      nombre: 'Papas fritas',
      descripcion: 'Papas fritas crocantes con salsa especial',
      precio: 2200,
      tiempo_estimado: 10,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Papas+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Papas+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Papas+3',
      ],
      cantidad: 0,
    },
    {
      id: 'f3',
      nombre: 'Ensalada César',
      descripcion: 'Lechuga, pollo grillado, croutons, parmesano',
      precio: 3200,
      tiempo_estimado: 8,
      fotos: [
        'https://placehold.co/400x300/F5A623/1A1A1A?text=Ensalada+1',
        'https://placehold.co/400x300/B71C1C/FFFFFF?text=Ensalada+2',
        'https://placehold.co/400x300/6E4839/FFFFFF?text=Ensalada+3',
      ],
      cantidad: 0,
    },
  ]);

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
}