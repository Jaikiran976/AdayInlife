import { AfterViewInit, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomTextEditorComponent } from '../custom-text-editor/custom-text-editor.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { HttpClient } from '@angular/common/http';
import { CustomCalendarComponent } from "../custom-calendar/custom-calendar.component";
import { ToastService } from '../../../Services/ToastServices/toast.service';
import { AppText } from '../../../../assets/data/constants/texts';

@Component({
  selector: 'app-diary-entry',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CustomTextEditorComponent,
    CustomDropdownComponent,
    CustomCalendarComponent
  ],
  templateUrl: './diary-entry.component.html',
  styleUrls: ['./diary-entry.component.scss'],
})
export class DiaryEntryComponent {
  diarySrv = inject(DiaryEntriesService);
  sanitizer = inject(DomSanitizer);
  toast= inject(ToastService);

  JsonContent: string = '';
  livePreviewHtml: SafeHtml = '';
  showPreview = false;
  text= AppText;

  // Set default date as today in yyyy-MM-dd format
  diaryDate: Date = new Date(); // store Date type, not string
  modeOfDay: string = '';
  moodOptions = ['😊 Happy', '😢 Sad', '😄 Excited', '😡 Angry', '😌 Calm'];
  mode: string = 'Select mood...';

  @Output() contentChange = new EventEmitter<string>();

  constructor(private http: HttpClient) { }

  saveDiary() {
    const token = sessionStorage.getItem('TokenData') || '';

    const cleanedContent = (this.JsonContent || '').replace(/&nbsp;/g, ' ');

    const newEntry = {
      token,
      content: cleanedContent,
      mood: this.modeOfDay,
      date: this.diaryDate?.toISOString() || '',
    };

    this.diarySrv.addNewEntry(newEntry).subscribe({
      next: () => {
        this.JsonContent = '';
        this.modeOfDay = '';
        this.showPreview = false;

        this.toast.show(this.text.sucessMessages.entrySaved);
      },
      error: (err) => {
        console.error('Error saving diary:', err);
      },
    });
  }

  onContentChange(event: string) {
    this.JsonContent = event;
    this.livePreviewHtml = this.sanitizer.bypassSecurityTrustHtml(event);
    this.contentChange.emit(event);
  }
}
