import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordModel } from '../../../Models/ChangePassword.module';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { AppText } from '../../../../assets/data/constants/texts';
import { ToastService } from '../../../Services/ToastServices/toast.service';

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
  isLoading: boolean = false;
  errorMessage: string = "";

  route = inject(Router);
  authSrv = inject(AuthServiceService);
  toast = inject(ToastService);

  fetchQuestion() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authSrv.getSecurityQuestion(this.changePasswordObj.usernameOrEmail).subscribe({
      next: (params: any) => {
        this.changePasswordObj.securityQuestion = params.question;
        this.isLoading = false;
        this.answerIt = true;
        this.reset = false;
        this.changePassword = false;
      },
      error: (response) => {
        if (response.status === 404) {
          this.errorMessage = 'Account not found. Please check your username or email.';
        } else {
          this.errorMessage = 'Failed to fetch question. Please try again later.';
        }

        this.isLoading = false;
      }
    });
  }

  checkAnswer() {
    this.isLoading = true;

    this.authSrv.verifyAnswer(this.changePasswordObj).subscribe({
      next: (params: any) => {
        this.isLoading = false;
        this.answerIt = false;
        this.reset = false;
        this.changePassword = true;
      },
      error: (response) => {
        if (response.status === 401) {
          this.errorMessage = 'Incorrect answer. Please try again.';
        } else {
          this.errorMessage = 'Failed to check answer. Please try again later.';
        }

        this.isLoading = false;
      }
    });
  }

  resetPassword() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authSrv.changePassword(this.changePasswordObj).subscribe({
      next: (params: any) => {
        this.isLoading = false;
        this.toast.show(this.text.form.sucessMessages.changedPassword, 'success')
        this.showSignIn();
      },
      error: (response) => {
        this.errorMessage = 'Failed to change the password. Please try again later.';
        this.isLoading = false;
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
