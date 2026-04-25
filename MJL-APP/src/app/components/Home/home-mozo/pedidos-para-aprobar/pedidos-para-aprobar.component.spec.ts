import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidosParaAprobarComponent } from './pedidos-para-aprobar.component';

describe('PedidosParaAprobarComponent', () => {
  let component: PedidosParaAprobarComponent;
  let fixture: ComponentFixture<PedidosParaAprobarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosParaAprobarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosParaAprobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
