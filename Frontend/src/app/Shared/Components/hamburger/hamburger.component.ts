import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hamburger',
  imports: [CommonModule, RouterModule],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss'
})
export class HamburgerComponent {
  isChecked: boolean = false;
  menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'All Entries', path: '/allentries' },
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
