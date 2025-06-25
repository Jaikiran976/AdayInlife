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
  @Input() placeholder: string = 'Select...';
  @Input() disabled: boolean = false;

  selected: string | null = null;
  isOpen = false;
  isTouched = false;
  isOptionSelected = false;

  focusedOptionIndex: number = -1;

  onChange = (value: any) => { };
  onTouched = () => { };

  constructor(private _eref: ElementRef) { }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this.isTouched = true;

    // Reset focused option index when opening
    if (this.isOpen) {
      this.focusedOptionIndex = this.selected ? this.options.indexOf(this.selected) : -1;
    }
  }

  selectOption(option: string, e?: Event) {
    if (e) e.stopPropagation();
    if (this.disabled) return;

    this.selected = option;
    this.isOptionSelected = true;
    this.isOpen = false;
    this.focusedOptionIndex = -1;

    this.onChange(option);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.isOpen && !this._eref.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.focusedOptionIndex = -1;
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    // Check if the new focused element is outside the component
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (relatedTarget && !this._eref.nativeElement.contains(relatedTarget)) {
      this.isOpen = false;
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else if (this.focusedOptionIndex > -1) {
          this.selectOption(this.options[this.focusedOptionIndex]);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.focusedOptionIndex = (this.focusedOptionIndex + 1) % this.options.length;
          this.scrollOptionIntoView();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.focusedOptionIndex = (this.focusedOptionIndex - 1 + this.options.length) % this.options.length;
          this.scrollOptionIntoView();
        }
        break;

      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.isOpen = false;
          this.focusedOptionIndex = -1;
        }
        break;
    }
  }

  // Scrolls the focused option into view inside the dropdown container
  scrollOptionIntoView() {
    const optionsContainer = this._eref.nativeElement.querySelector('.dropdown-options');
    if (!optionsContainer) return;

    const focusedOption = optionsContainer.children[this.focusedOptionIndex];
    if (focusedOption) {
      focusedOption.scrollIntoView({ block: 'nearest' });
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selected = value;
    this.isOptionSelected = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}