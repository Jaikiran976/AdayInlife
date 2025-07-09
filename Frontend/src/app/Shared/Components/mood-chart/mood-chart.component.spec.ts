import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodChartComponent } from './mood-chart.component';

describe('MoodChartComponent', () => {
  let component: MoodChartComponent;
  let fixture: ComponentFixture<MoodChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
