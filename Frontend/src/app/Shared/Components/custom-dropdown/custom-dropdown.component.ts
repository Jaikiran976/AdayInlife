import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomDropdownComponent),
    multi: true
  }]
})
export class CustomDropdownComponent implements ControlValueAccessor {
  @Input() options: string[] = [];
  @Input() placeholder: string = '';
  
  selected: string = 'Select...';
  isOpen = false;
  isTouched = false;
  isOptionSelected = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private _eref: ElementRef) {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.isTouched = true;
  }

  selectOption(option: string, e: Event) {
    e.stopPropagation();
    this.selected = option;
    this.isOpen = false;
    this.isOptionSelected = true;
    this.onChange(option);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.isOpen && !this._eref.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: handle disabled state
  }
}
