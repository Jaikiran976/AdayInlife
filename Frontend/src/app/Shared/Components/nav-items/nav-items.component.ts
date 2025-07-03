import { Component, inject } from '@angular/core';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-items.component.html',
  styleUrl: './nav-items.component.scss'
})
export class NavItemsComponent {
  isChecked: boolean = false;
  menuItems = [
    { label: 'New Entry', path: '/home' , icon:'fa-pen-nib'},
    { label: 'Entries', path: '/allentries', icon:'fa-book' }
  ];

  auth = inject(AuthServiceService);

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.toggleCheckbox();
    }
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  logOut() {
    this.auth.signOut();
  }
}
