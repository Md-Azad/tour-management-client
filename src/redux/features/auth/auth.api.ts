import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOTP } from "@/types";

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
  }),
});

export const { useRegisterMutation, useLoginMutation, useSendOTPMutation } =
  authApi;
