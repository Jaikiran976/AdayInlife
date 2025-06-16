import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-calendar.component.html',
  styleUrl: './custom-calendar.component.scss'
})
export class CustomCalendarComponent {
  @Input() selectedDate: Date | null = null;
  @Output() selectedDateChange = new EventEmitter<Date>();

  showCalendar = false;

  currentYear: number;
  currentMonth: number;

  today: Date;

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private _eref: ElementRef) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0); // Ensure time doesn't affect comparisons
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();

    if (!this.selectedDate) {
      this.selectedDate = this.today;
    }
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.showCalendar && !this._eref.nativeElement.contains(event.target)) {
      this.showCalendar = false;
    }
  }

  prevYear() {
    this.currentYear--;
  }

  nextYear() {
    if (this.currentYear < this.today.getFullYear()) {
      this.currentYear++;
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    const nextMonth = this.currentMonth + 1;
    const nextYear = this.currentYear + (nextMonth > 11 ? 1 : 0);
    const adjustedMonth = nextMonth % 12;

    if (new Date(nextYear, adjustedMonth, 1) > this.today) return;

    this.currentMonth = adjustedMonth;
    this.currentYear = nextYear;
  }

  get daysInMonth(): number[] {
    const numDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }

  get blanks(): undefined[] {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    return Array(firstDayOfMonth);
  }

  get selectedDateString(): string {
    if (!this.selectedDate) return '';
    const y = this.selectedDate.getFullYear();
    const m = this.selectedDate.getMonth() + 1;
    const d = this.selectedDate.getDate();
    return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  }

  selectDate(day: number) {
    const selected = new Date(this.currentYear, this.currentMonth, day);
    selected.setHours(0, 0, 0, 0);

    if (selected > this.today) return;

    this.selectedDate = selected;
    this.selectedDateChange.emit(this.selectedDate);
    this.showCalendar = false;
  }

  isSelected(day: number) {
    if (!this.selectedDate) return false;
    return (
      this.selectedDate.getFullYear() === this.currentYear &&
      this.selectedDate.getMonth() === this.currentMonth &&
      this.selectedDate.getDate() === day
    );
  }

  isFutureDate(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return date > this.today;
  }

  isNextMonthDisabled(): boolean {
    const nextMonth = this.currentMonth + 1;
    const nextYear = this.currentYear + (nextMonth > 11 ? 1 : 0);
    const adjustedMonth = nextMonth % 12;
    return new Date(nextYear, adjustedMonth, 1) > this.today;
  }
}
