import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { StripHtmlPipe } from '../../pipes/strip-html.pipe';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { ToastService } from '../../../Services/ToastServices/toast.service';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

interface EntryWithExpanded extends UpdateEntryModel {
  expanded?: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-entries-list',
  imports: [CommonModule, StripHtmlPipe, ConfirmDialogComponent],
  templateUrl: './entries-list.component.html',
  styleUrl: './entries-list.component.scss'
})

export class EntriesListComponent {
  @Input() entries: EntryWithExpanded[] = [];
  diarySrv = inject(DiaryEntriesService);
  toast = inject(ToastService);

  showConfirmDialog = false;
  confirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: ''
  };
  entryToDelete: EntryWithExpanded | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries?.length) {
      this.entries = this.entries.map(entry => ({
        ...entry,
        expanded: false,
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  onEdit(entry: EntryWithExpanded): void {
    entry.editing = true;
    entry.expanded = false;
  }

  onSave(entry: EntryWithExpanded): void {
    // TODO: Replace with real API call
    console.log('Saving updated entry:', entry);

    entry.editing = false;
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
  onConfirmDelete(){
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
