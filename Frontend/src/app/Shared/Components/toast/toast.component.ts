import { Component } from '@angular/core';
import { ToastService } from '../../../Services/ToastServices/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  message:string ="";

  constructor(public toastService: ToastService) {}
}
