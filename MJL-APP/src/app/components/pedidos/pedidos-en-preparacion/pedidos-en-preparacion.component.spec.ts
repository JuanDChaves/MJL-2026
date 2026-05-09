import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidosEnPreparacionComponent } from './pedidos-en-preparacion.component';

describe('PedidosEnPreparacionComponent', () => {
  let component: PedidosEnPreparacionComponent;
  let fixture: ComponentFixture<PedidosEnPreparacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosEnPreparacionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosEnPreparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
