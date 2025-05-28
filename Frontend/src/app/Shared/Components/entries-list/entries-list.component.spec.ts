import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesListComponent } from './entries-list.component';

describe('EntriesListComponent', () => {
  let component: EntriesListComponent;
  let fixture: ComponentFixture<EntriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
