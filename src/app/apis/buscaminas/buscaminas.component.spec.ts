import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaminasComponent } from './buscaminas.component';

describe('BuscaminasComponent', () => {
  let component: BuscaminasComponent;
  let fixture: ComponentFixture<BuscaminasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaminasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaminasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
