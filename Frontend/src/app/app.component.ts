import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "./Shared/Components/toast/toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Frontend';
  isDark = false;

  ngOnInit() {
    const stored = localStorage.getItem('darkMode');
    this.isDark = stored === 'true';
  }

  toggleTheme() {
    this.isDark = !this.isDark
    localStorage.setItem('darkMode', this.isDark ? 'true' : 'false');
  }
}
