import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignInModel } from '../../Models/signin.module';
import { Observable } from 'rxjs';
import { SignUpModel } from '../../Models/signup.module';
import { environment } from '../../../environments/environment';
import { ChangePasswordModel } from '../../Models/ChangePassword.module';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  baseapiurl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  //call api to check if user exists
  signInTheUser(user: SignInModel): Observable<SignInModel> {
    return this.http.post<SignInModel>(
      `${this.baseapiurl}/api/Auth/SignIn`,
      user
    );
  }

  //call api to create a new user if user doesn't exist already
  signUpTheUser(user: SignUpModel): Observable<SignUpModel> {
    return this.http.post<SignUpModel>(
      `${this.baseapiurl}/api/Auth/SignUp`,
      user
    );
  }

  //call api to get the security question to change password
  getSecurityQuestion(usernameOrEmail: string): Observable<{ question: string }> {
    return this.http.get<{ question: string }>(
      `${this.baseapiurl}/api/auth/GetSecurityQuestion?usernameOrEmail=${usernameOrEmail}`
    );
  }

  //call api to verify the answer given by user to change password
  verifyAnswer(user: ChangePasswordModel): Observable<ChangePasswordModel> {
    return this.http.post<ChangePasswordModel>(
      `${this.baseapiurl}/api/Auth/VerifyAnswer`,
      user
    )
  }

  //call api to change the password
  changePassword(user: ChangePasswordModel): Observable<ChangePasswordModel> {
    return this.http.put<ChangePasswordModel>(
      `${this.baseapiurl}/api/Auth/ChangeThePassword`,
      user
    )
  }

  //check if user is already signed in 
  isSignedIn(): boolean {
    const token = sessionStorage.getItem('TokenData');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      const isExpired = Date.now() >= payload.exp * 1000;
      return !isExpired;
    } catch (e) {
      // Invalid token structure or base64 decoding failed
      return false;
    }
  }


  //add token to signin the user
  signIn(token: string): void {
    sessionStorage.setItem('TokenData', token);
  }

  //remove token to sign out the user
  signOut(): void {
    sessionStorage.removeItem('TokenData');
  }

  getUsername(): Observable<any> {
    const token = sessionStorage.getItem('TokenData');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseapiurl}/api/auth/GetUsername`, { headers });
  }
}
