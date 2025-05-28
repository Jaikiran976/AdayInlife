import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomTextEditorComponent } from '../custom-text-editor/custom-text-editor.component';
import { HttpClient } from '@angular/common/http';
import { NewEntry } from '../../../Models/newEntry.module';
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-diary-entry',
  standalone: true,
  imports: [FormsModule, CustomTextEditorComponent],
  templateUrl: './diary-entry.component.html',
  styleUrls: ['./diary-entry.component.scss'],
})
export class DiaryEntryComponent {
  diarySrv = inject(DiaryEntriesService);
  sanitizer = inject(DomSanitizer);
  newEntry: NewEntry =
    {
      token: '',
      content: ''
    };

  constructor(private http: HttpClient) { }

  getSanitizedHtml(html: string): SafeHtml {
    const replaced = html.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  saveDiary() {
    var token = sessionStorage.getItem('TokenData');
    if (token == null)
      token = '';

    this.newEntry.token = token;
    console.log(this.newEntry.content);
    this.diarySrv.addNewEntry(this.newEntry).subscribe({
      next: (params: any) => {
        console.log("its added");
      },
      error: (response) => {
      }
    });
  }
}
