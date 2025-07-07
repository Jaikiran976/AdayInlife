import { Component, inject } from '@angular/core';
import { EntriesListComponent } from "../entries-list/entries-list.component";
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCalendarComponent } from "../custom-calendar/custom-calendar.component";
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';

interface UpdateEntryWithDate extends UpdateEntryModel {
  dateObj: Date;
}

@Component({
  selector: 'app-all-entries',
  imports: [EntriesListComponent, CommonModule, FormsModule, CustomCalendarComponent, CustomDropdownComponent, RouterModule],
  templateUrl: './all-entries.component.html',
  styleUrl: './all-entries.component.scss'
})
export class AllEntriesComponent {
  diarySrv = inject(DiaryEntriesService);

  entries: UpdateEntryModel[] = [];
  allEntries: UpdateEntryWithDate[] = [];
  filteredEntries: UpdateEntryWithDate[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedMood: string = '';

  moodOptions = ['😊 Happy', '😢 Sad', '😄 Excited', '😡 Angry', '😌 Calm'];

  constructor() {
    const token = sessionStorage.getItem('TokenData') || '';

    this.diarySrv.getAllEntries(token).subscribe({
      next: (params: UpdateEntryModel[]) => {
        this.entries = params;

        // Convert entry dates to Date objects
        this.allEntries = this.entries.map(e => ({
          ...e,
          dateObj: new Date(e.date)
        }));

        if (this.allEntries.length > 0) {
          const minDate = this.allEntries.reduce((min, entry) =>
            entry.dateObj < min ? entry.dateObj : min,
            this.allEntries[0].dateObj
          );
          this.startDate = minDate;
        } else {
          const today = new Date();
          this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        }

        this.endDate = new Date();

        // Initialize with all entries
        this.filteredEntries = [...this.allEntries];
      },
      error: (response) => {
        // handle error
      }
    });
  }

  applyFilter() {
    this.filteredEntries = this.allEntries.filter(entry => {
      const entryDate = entry.dateObj;
      const afterStart = this.startDate ? entryDate >= this.startDate : true;
      const beforeEnd = this.endDate ? entryDate <= this.endDate : true;
      const moodMatch = this.selectedMood ? entry.mood === this.selectedMood : true;
      return afterStart && beforeEnd && moodMatch;
    });
  }

  clearFilter() {
    const today = new Date();

    this.endDate = today;

    if (this.allEntries.length > 0) {
      // Find earliest date in entries
      const earliestDate = this.allEntries.reduce((minDate, entry) =>
        entry.dateObj < minDate ? entry.dateObj : minDate, this.allEntries[0].dateObj);
      this.startDate = earliestDate;
    } else {
      // Fallback: first day of current month
      this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.selectedMood = '';
    this.filteredEntries = [...this.allEntries];
  }
}
