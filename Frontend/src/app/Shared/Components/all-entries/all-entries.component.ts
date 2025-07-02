import { Component, inject } from '@angular/core';
import { EntriesListComponent } from "../entries-list/entries-list.component";
import { DiaryEntriesService } from '../../../Services/DiaryEntryService/diary-entries.service';
import { UpdateEntryModel } from '../../../Models/updateentry.module';

@Component({
  selector: 'app-all-entries',
  imports: [EntriesListComponent],
  templateUrl: './all-entries.component.html',
  styleUrl: './all-entries.component.scss'
})
export class AllEntriesComponent {
  diarySrv = inject(DiaryEntriesService);
  entries: UpdateEntryModel[] = [];
  
  constructor() {
    var token = sessionStorage.getItem('TokenData');
    if (token == null)
      token = '';

    this.diarySrv.getAllEntries(token).subscribe({
      next: (params: any) => {
        this.entries = params;
      },
      error: (response) => {

      }
    });
  }
}
