import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomTextEditorComponent } from '../custom-text-editor/custom-text-editor.component';
import { HttpClient } from '@angular/common/http';
import { NewEntry } from '../../../Models/newEntry.module';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diary-entry',
  standalone: true,
  imports: [FormsModule, CustomTextEditorComponent, CommonModule],
  templateUrl: './diary-entry.component.html',
  styleUrls: ['./diary-entry.component.scss'],
})
export class DiaryEntryComponent {
  diarySrv = inject(DiaryEntriesService);
  sanitizer = inject(DomSanitizer);
  JsonContent: string = '';
  livePreviewHtml: SafeHtml = ''; // live preview HTML
  showPreview = false;
  @Output() contentChange = new EventEmitter<string>();

  constructor(private http: HttpClient) {
  }

  getSanitizedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  saveDiary() {
    let token = sessionStorage.getItem('TokenData') || '';

    // Replace non-breaking spaces with normal spaces before saving
    const cleanedContent = this.JsonContent.replace(/&nbsp;/g, ' ');

    const newEntry: NewEntry = {
      token: token,
      content: cleanedContent,
    };

    this.diarySrv.addNewEntry(newEntry).subscribe({
      next: (params: any) => {
        // handle success
      },
      error: (response) => {
        // handle error
      }
    });
  }

  onContentChange(newHtmlContent: string) {
    // Replace non-breaking spaces with normal spaces for preview only
    const normalizedHtml = newHtmlContent.replace(/&nbsp;/g, ' ');
    this.JsonContent = newHtmlContent;  // keep original for save
    this.livePreviewHtml = this.sanitizer.bypassSecurityTrustHtml(normalizedHtml);
  }
}
