import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { SafeHtmlPipe } from '../../pipes/SafeHtml.pipe';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { ToastService } from '../../../Services/ToastServices/toast.service';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { CustomCalendarComponent } from "../custom-calendar/custom-calendar.component";
import { CustomTextEditorComponent } from "../custom-text-editor/custom-text-editor.component";
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { FormsModule } from '@angular/forms';
import { StripHtmlPipe } from "../../pipes/StripHtml.pipe";
import { DomSanitizer } from '@angular/platform-browser';

interface EntryWithExpanded extends UpdateEntryModel {
  expanded?: boolean;
  editing?: boolean;
  tempContent?: string;
  tempDate?: string;
  tempMood?: string;
  isSaving?: boolean;
}

@Component({
  selector: 'app-entries-list',
  imports: [
    CommonModule,
    FormsModule,
    SafeHtmlPipe,
    ConfirmDialogComponent,
    CustomCalendarComponent,
    CustomTextEditorComponent,
    CustomDropdownComponent,
    StripHtmlPipe
  ],
  templateUrl: './entries-list.component.html',
  styleUrl: './entries-list.component.scss'
})

export class EntriesListComponent {
  @Input() entries: EntryWithExpanded[] = [];

  diarySrv = inject(DiaryEntriesService);
  toast = inject(ToastService);
  moodOptions = ['😊 Happy', '😢 Sad', '😄 Excited', '😡 Angry', '😌 Calm'];
  showConfirmDialog = false;
  confirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: ''
  };
  entryToDelete: EntryWithExpanded | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries?.length) {
      this.entries = this.entries.map(entry => ({
        ...entry,
        expanded: false,
        tempContent: entry.content,
        tempDate: entry.date,
        tempMood: entry.mood,
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  onEdit(entry: EntryWithExpanded): void {
    entry.editing = true;
    entry.expanded = false;
  }

  onSave(entry: EntryWithExpanded): void {
    entry.isSaving = true;
    const cleanedContent = (entry.tempContent || '').replace(/&nbsp;/g, ' ');

    const updatedEntry = {
      id: entry.id,
      userName: entry.userName,
      token: sessionStorage.getItem('TokenData') || '',
      content: cleanedContent,
      mood: entry.tempMood || '',
      date: entry.tempDate || new Date().toISOString()
    };

    this.diarySrv.updateEntry(updatedEntry).subscribe({
      next: () => {
        entry.content = cleanedContent;
        entry.date = updatedEntry.date;
        entry.mood = updatedEntry.mood;
        entry.editing = false;

        entry.isSaving = false;
        this.toast.show('✅ Entry updated successfully', 'success');
      },
      error: () => {
        entry.isSaving = false;
        this.toast.show('❌ Failed to update the entry', 'error');
      }
    });
  }

  onCancelEdit(entry: EntryWithExpanded): void {
    entry.tempContent = entry.content;
    entry.tempDate = entry.date;
    entry.tempMood = entry.mood;
    entry.editing = false;
  }

  toDate(dateStr: string | Date | undefined | null): Date {
    if (!dateStr) {
      return new Date(); // fallback to current date or any default you prefer
    }
    return dateStr instanceof Date ? dateStr : new Date(dateStr);
  }


  //send dialog box to confirm the deletion
  onDeleteClicked(entry: EntryWithExpanded) {
    this.entryToDelete = entry;
    this.confirmDialogData = {
      title: 'Delete Entry',
      message: `Are you sure you want to delete the entry?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };
    this.showConfirmDialog = true;
  }

  //delete the entry 
  onConfirmDelete() {
    if (!this.entryToDelete) return;

    this.diarySrv.deleteEntry(this.entryToDelete.id).subscribe({
      next: (params: any) => {
        this.entries = this.entries.filter(e => e.id !== this.entryToDelete?.id);
        this.closeConfirmDialog();
        this.toast.show('✅ Entry deleted successfully', 'success');
      },
      error: (response) => {
        this.closeConfirmDialog();
        if (response.status === 404) {
          this.toast.show('⚠️ Entry not found. It may have already been deleted.', 'warning');
        } else {
          this.toast.show('❌ Something went wrong while deleting the entry.', 'error');
        }
      }
    });
  }

  //close dialog box 
  closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.entryToDelete = null;
  }
}
