import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordModel } from '../../../Models/ChangePassword.module';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { AppText } from '../../../constants/texts';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})

export class ForgotPasswordComponent {
  text = AppText;

  changePasswordObj: ChangePasswordModel =
    {
      usernameOrEmail: "",
      securityQuestion: "",
      newPassword: "",
      securityAnswer: ""
    };

  confirmPassword: string = "";
  reset: boolean = true;
  answerIt: boolean = false;
  changePassword: boolean = false;

  route = inject(Router);
  authSrv = inject(AuthServiceService);

  fetchQuestion() {
    this.authSrv.getSecurityQuestion(this.changePasswordObj.usernameOrEmail).subscribe({
      next: (params: any) => {
        this.changePasswordObj.securityQuestion = params.question;
        this.answerIt = true;
        this.reset = false;
        this.changePassword = false;
      },
      error: (response) => {

      }
    });
  }

  checkAnswer() {
    this.authSrv.verifyAnswer(this.changePasswordObj).subscribe({
      next: (params: any) => {
        this.answerIt = false;
        this.reset = false;
        this.changePassword = true;
      },
      error: (response) => {

      }
    });
  }

  resetPassword() {
    this.authSrv.changePassword(this.changePasswordObj).subscribe({
      next: (params: any) => {
        this.showSignIn();
      },
      error: (response) => {

      }
    });
  }

  showSignIn() {
    this.answerIt = false;
    this.reset = true;
    this.changePassword = false;
    this.route.navigate(['/signin']);
  }
}
