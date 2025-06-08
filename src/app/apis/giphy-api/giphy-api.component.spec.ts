import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiphyApiComponent } from './giphy-api.component';

describe('GiphyApiComponent', () => {
  let component: GiphyApiComponent;
  let fixture: ComponentFixture<GiphyApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiphyApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiphyApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
