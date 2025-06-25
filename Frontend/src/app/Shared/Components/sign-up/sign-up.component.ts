import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SignUpModel } from '../../../Models/signup.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../Services/AuthServices/auth-service.service';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { CommonModule } from '@angular/common';
import { AppText } from '../../../../assets/data/constants/texts';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CustomDropdownComponent, CommonModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  text = AppText; //for constant texts

  signUpObj: SignUpModel =
    {
      userName: "",
      email: "",
      password: "",
      securityQuestion: "",
      securityAnswer: ""
    };

  journalQuestions = [
    "When did you write your first entry?",
    "What date stands out in your journal?",
    "Who do you write about most?",
    "Where do you usually write?",
    "What memory do you revisit the most?",
  ];

  //patterns
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  isLoading: boolean = false;
  signUpError: string = "";

  route = inject(Router);
  authSrv = inject(AuthServiceService);

  SignUp() {
    this.signUpError = '';
    this.isLoading = true;

    this.authSrv.signUpTheUser(this.signUpObj).subscribe({
      next: (params: any) => {
        this.route.navigateByUrl('/signin');
        this.isLoading = true;
      },
      error: (response) => {
        if (response.status === 409) {
          this.signUpError = response.error.message;
        } else {
          this.signUpError = 'Sign-Up failed. Please try again later.';
        }

        this.isLoading = false;
      }
    });
  }
}
