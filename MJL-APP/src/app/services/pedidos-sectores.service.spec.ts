import { TestBed } from '@angular/core/testing';

import { PedidosSectoresService } from './pedidos-sectores.service';

describe('PedidosSectoresService', () => {
  let service: PedidosSectoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosSectoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
