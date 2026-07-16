import { TestBed } from '@angular/core/testing';

import { Componente } from './componente';

describe('Componente', () => {
  let service: Componente;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Componente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
