export interface ILogin {
  email: string;
  password: string;
}
export interface IVerifyOTP {
  email: string;
  otp: string;
}

export interface ISendOTP {
  email: string;
  name?: string;
}
