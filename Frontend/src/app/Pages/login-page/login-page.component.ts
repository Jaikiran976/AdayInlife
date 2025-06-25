import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppText } from '../../../assets/data/constants/texts';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,RouterOutlet],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  text = AppText;
}
