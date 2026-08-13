import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tallas } from './tallas';

describe('Tallas', () => {
  let component: Tallas;
  let fixture: ComponentFixture<Tallas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tallas],
    }).compileComponents();

    fixture = TestBed.createComponent(Tallas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
