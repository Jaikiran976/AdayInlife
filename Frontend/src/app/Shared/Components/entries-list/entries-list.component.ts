import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateEntryModel } from '../../../Models/updateentry.module';
import { StripHtmlPipe } from '../../pipes/strip-html.pipe';

interface EntryWithExpanded extends UpdateEntryModel {
  expanded?: boolean;
}

@Component({
  selector: 'app-entries-list',
  imports: [CommonModule, StripHtmlPipe],
  templateUrl: './entries-list.component.html',
  styleUrl: './entries-list.component.scss'
})

export class EntriesListComponent {
  @Input() entries: EntryWithExpanded[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries?.length) {
      this.entries = this.entries.map(entry => ({
        ...entry,
        expanded: false,
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }
}
