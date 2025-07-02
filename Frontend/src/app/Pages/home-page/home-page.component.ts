import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../Services/AuthServices/auth-service.service';
import { NavItemsComponent } from "../../Shared/Components/nav-items/nav-items.component";

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterOutlet, NavItemsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  username: string = "";
  route = inject(Router);
  auth = inject(AuthServiceService);
  today: Date = new Date();

  constructor() {
    this.getUsername();
  }

  getUsername() {
   this.auth.getUsername().subscribe({
      next: (response: any) => {
        this.username = response.username;
      },
      error: (err) => {
        console.error('Failed to get username:', err);
        sessionStorage.removeItem('TokenData');
      }
    });
  }
}
