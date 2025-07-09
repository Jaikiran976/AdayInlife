import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EntriesListComponent } from "../entries-list/entries-list.component";
import { CustomCalendarComponent } from "../custom-calendar/custom-calendar.component";
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';

import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { AppText } from '../../../../assets/data/constants/texts';

interface UpdateEntryWithDate extends UpdateEntryModel {
  dateObj: Date;
}

@Component({
  selector: 'app-all-entries',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EntriesListComponent,
    CustomCalendarComponent,
    CustomDropdownComponent
  ],
  templateUrl: './all-entries.component.html',
  styleUrl: './all-entries.component.scss'
})
export class AllEntriesComponent {
  diarySrv = inject(DiaryEntriesService);
  text = AppText;

  entries: UpdateEntryModel[] = [];
  allEntries: UpdateEntryWithDate[] = [];
  filteredEntries: UpdateEntryWithDate[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedMood = '';
  errorMessage = '';
  isloading = true;

  moodOptions = this.text.moodOptions;

  constructor() {
    this.fetchEntries();
  }

  fetchEntries() {
    this.setLoadingState(true);

    const token = sessionStorage.getItem('TokenData') || '';

    this.diarySrv.getAllEntries(token).subscribe({
      next: (entries) => this.handleSuccess(entries),
      error: () => this.handleError()
    });
  }

  handleSuccess(entries: UpdateEntryModel[]) {
    this.entries = entries;
    this.allEntries = this.mapEntriesWithDate(entries);

    this.startDate = this.getEarliestDate(this.allEntries);
    this.endDate = new Date();

    this.filteredEntries = [...this.allEntries];
    this.setLoadingState(false);
  }

  handleError() {
    this.errorMessage = 'Failed to load entries. Please try again later.';
    this.setLoadingState(false);
  }

  retry() {
    this.errorMessage = '';
    this.fetchEntries();
  }

  mapEntriesWithDate(entries: UpdateEntryModel[]): UpdateEntryWithDate[] {
    return entries.map(e => ({
      ...e,
      dateObj: new Date(e.date)
    }));
  }

  getEarliestDate(entries: UpdateEntryWithDate[]): Date {
    if (entries.length === 0) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1); // 1st of month
    }

    return entries.reduce((min, entry) => entry.dateObj < min ? entry.dateObj : min, entries[0].dateObj);
  }

  setLoadingState(state: boolean) {
    this.isloading = state;
  }

  applyFilter() {
    this.filteredEntries = this.allEntries.filter(entry => {
      const afterStart = this.startDate ? entry.dateObj >= this.startDate : true;
      const beforeEnd = this.endDate ? entry.dateObj <= this.endDate : true;
      const moodMatch = this.selectedMood ? entry.mood === this.selectedMood : true;
      return afterStart && beforeEnd && moodMatch;
    });
  }

  clearFilter() {
    this.selectedMood = '';
    this.endDate = new Date();
    this.startDate = this.getEarliestDate(this.allEntries);
    this.filteredEntries = [...this.allEntries];
  }
}
