export interface ChangePasswordModel {
  usernameOrEmail: string;
  securityQuestion: string;
  securityAnswer: string;
  newPassword: string;
}