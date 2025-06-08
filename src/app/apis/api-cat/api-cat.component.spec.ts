import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCatComponent } from './api-cat.component';

describe('ApiCatComponent', () => {
  let component: ApiCatComponent;
  let fixture: ComponentFixture<ApiCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
