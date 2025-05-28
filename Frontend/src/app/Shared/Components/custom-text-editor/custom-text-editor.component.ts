import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-custom-text-editor',
  imports: [FormsModule, QuillModule],
  templateUrl: './custom-text-editor.component.html',
  styleUrl: './custom-text-editor.component.scss'
})
export class CustomTextEditorComponent {
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  @Input() placeholder: string = 'Write here...';

  private _toolbarId: string = '';

  @Input()
  set toolbarId(value: string) {
    this._toolbarId = value || this.generateDefaultId();
    this.updateEditorModules();
  }

  get toolbarId(): string {
    return this._toolbarId;
  }

  editorModules: any;

  constructor() {
    const icons: any = Quill.import('ui/icons') as Record<string, string>;

    icons['bold'] = '<i class="fa fa-bold"></i>';
    icons['italic'] = '<i class="fa fa-italic"></i>';
    icons['underline'] = '<i class="fa fa-underline"></i>';
    icons['ordered'] = '<i class="fa fa-list-ol"></i>';
    icons['bullet'] = '<i class="fa fa-list-ul"></i>';
    icons['clean'] = '<i class="fa fa-eraser"></i>';
    icons['link'] = `<i class="fa fa-link"></i>`;
    icons['list'] = {
      ordered: '<i class="fa fa-list-ol"></i>',
      bullet: '<i class="fa fa-list-ul"></i>',
    };

    // Initialize default toolbarId & modules in constructor in case input not set yet
    if (!this._toolbarId) {
      this._toolbarId = this.generateDefaultId();
      this.updateEditorModules();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // In case toolbarId changes from parent after init
    if (changes['toolbarId'] && changes['toolbarId'].currentValue) {
      this._toolbarId = changes['toolbarId'].currentValue || this.generateDefaultId();
      this.updateEditorModules();
    }
  }

  private updateEditorModules() {
    this.editorModules = {
      toolbar: {
        container: `#${this._toolbarId}`,
      },
    };
  }

  private generateDefaultId(): string {
    return 'toolbar-' + Math.random().toString(36).substring(2, 10);
  }

  onContentChanged(event: any) {
    this.contentChange.emit(event.html);
  }
}
