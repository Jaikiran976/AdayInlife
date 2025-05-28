import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextEditorComponent } from './custom-text-editor.component';

describe('CustomTextEditorComponent', () => {
  let component: CustomTextEditorComponent;
  let fixture: ComponentFixture<CustomTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
