import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEntryModel } from '../../../Models/updateentry.module';

@Component({
  selector: 'app-entries-list',
  imports: [CommonModule],
  templateUrl: './entries-list.component.html',
  styleUrl: './entries-list.component.scss'
})
export class EntriesListComponent {
  @Input() entries: UpdateEntryModel[] = [];
}
