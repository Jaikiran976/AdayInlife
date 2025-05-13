import { Component, inject } from '@angular/core';
import { SignInModel } from '../../../Models/signin.module';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInObj: SignInModel =
    {
      usernameOrEmail: "",
      password: ""
    };
  signInError: string = "";
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$';

  route = inject(Router);
  authSrv = inject(AuthServiceService);

  //Sign In to the site
  signIn() {
    this.authSrv.signInTheUser(this.signInObj).subscribe({
      next: (params: any) => {
        this.authSrv.signIn(params.token);
        this.route.navigateByUrl('/dashboard');
      },
      error: (response) => {
        if (response.status === 404) {
          this.signInError = 'User not found. Please check your credentials.';
        } else if(response.status === 401){
          this.signInError = 'Invalid credentials';
        } else{
          this.signInError = 'Login failed. Please try again later.';
        }
      }
    });
  }

  showSignUp() {
    this.route.navigate(['/signup']);
  }

  forgotPassword() {
    this.route.navigate(['/forgotpassword']);
  }
}
