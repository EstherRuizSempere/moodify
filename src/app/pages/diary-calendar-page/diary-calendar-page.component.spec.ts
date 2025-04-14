import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryCalendarPageComponent } from './diary-calendar-page.component';

describe('DiaryCalendarPageComponent', () => {
  let component: DiaryCalendarPageComponent;
  let fixture: ComponentFixture<DiaryCalendarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryCalendarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaryCalendarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
