import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiFunComponent } from './api-fun.component';

describe('ApiFunComponent', () => {
  let component: ApiFunComponent;
  let fixture: ComponentFixture<ApiFunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiFunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiFunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
