import { Routes } from '@angular/router';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { authGuard } from './Guards/auth guard/auth.guard';
import { loginGuard } from './Guards/login guard/login.guard';
import { SignInComponent } from './Shared/Components/sign-in/sign-in.component';
import { SignUpComponent } from './Shared/Components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './Shared/Components/forgot-password/forgot-password.component';
import { DiaryEntryComponent } from './Shared/Components/diary-entry/diary-entry.component';
import { AllEntriesComponent } from './Shared/Components/all-entries/all-entries.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "signin",
        pathMatch: "full"
    },
    {
        path: '',
        component: LoginPageComponent,
        canActivate: [loginGuard],
        children: [
            { path: "signin", component: SignInComponent },
            { path: "signup", component: SignUpComponent },
            { path: "forgotpassword", component: ForgotPasswordComponent }
        ]
    },
    {
        path: '',
        component: HomePageComponent,
        canActivate: [authGuard],
        children: [
            { path: 'home', component: DiaryEntryComponent },
            { path:'allentries', component: AllEntriesComponent }
        ]
    },
    { 
        path: '**', 
        redirectTo: 'signin' 
    } 
];
