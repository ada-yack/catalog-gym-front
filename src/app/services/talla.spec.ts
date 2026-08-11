import { TestBed } from '@angular/core/testing';

import { Talla } from './talla';

describe('Talla', () => {
  let service: Talla;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Talla);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
