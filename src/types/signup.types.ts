export interface SignupTypes {
  email: string;
  password: string;
  fullName: string;
}

export interface VerifyTypes {
  email: string;
  otpCode: string;
}

export interface ResetPassTypes {
  token: string | null;
  newPassword: string;
}
