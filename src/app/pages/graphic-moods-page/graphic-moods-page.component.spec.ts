import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicMoodsPageComponent } from './graphic-moods-page.component';

describe('GraphicMoodsPageComponent', () => {
  let component: GraphicMoodsPageComponent;
  let fixture: ComponentFixture<GraphicMoodsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicMoodsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicMoodsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
