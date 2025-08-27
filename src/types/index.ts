export type { ILogin, IVerifyOTP, ISendOTP } from "./auth.type.ts";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
