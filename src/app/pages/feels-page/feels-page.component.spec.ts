import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelsPageComponent } from './feels-page.component';

describe('FeelsPageComponent', () => {
  let component: FeelsPageComponent;
  let fixture: ComponentFixture<FeelsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeelsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
