import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOTP, IVerifyOTP } from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInput) => ({
        url: "/auth/login",
        method: "POST",
        data: userInput,
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOTP: builder.mutation<IResponse<null>, ISendOTP>({
      query: (email) => ({
        url: "/otp/send-otp",
        method: "POST",
        data: email,
      }),
    }),
    verifyOTP: builder.mutation<IResponse<null>, IVerifyOTP>({
      query: (payload) => {
        return {
          url: "/otp/verify-otp",
          method: "POST",
          data: payload,
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} = authApi;
