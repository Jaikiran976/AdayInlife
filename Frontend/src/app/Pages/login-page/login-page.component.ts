import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,RouterOutlet],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  // signIn: boolean = true;
  // signup: boolean = false;
  // forgotpassword:boolean =false;

  // showSignUp(){
  //   this.signIn =false;
  //   this.signup = true;
  //   this.forgotpassword =false
  // }

  // showSignIn(){
  //   this.signIn = true;
  //   this.signup = false;
  //   this.forgotpassword =false
  // }
}
