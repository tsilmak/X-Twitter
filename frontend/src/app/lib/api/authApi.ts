import { apiSlice } from "./apiSlice";

interface User {
  userId: number;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  birthDate: string;
  authorities: [roleId: string, authority: string];
  enabled: boolean;
}
interface RigsterResponse {
  username: string;
  name: string;
  email: string;
  birthDate: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  birthDate: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<RigsterResponse, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
        credentials: "include", // storing register_token in cookies for username validation
      }),
      invalidatesTags: ["Users"],
    }),
    sendEmailConfirmationCode: builder.mutation<string, { username: string }>({
      query: ({ username }) => ({
        url: "auth/email/code",
        method: "POST",
        body: { username },
        credentials: "include", //gets the username from the user and the cookies (register_user)
      }),
      invalidatesTags: ["Users"],
    }),
    verifyEmailConfirmationCode: builder.mutation<
      User,
      { code: string; username: string }
    >({
      query: ({ code, username }) => ({
        url: "auth/email/code/verify",
        method: "POST",
        body: { code, username },
        credentials: "include", //gets the username from the user and the cookies (register_user)
      }),
      invalidatesTags: ["Users"],
    }),
    updatePassword: builder.mutation<
      User,
      { password: string; username: string }
    >({
      query: ({ password, username }) => ({
        url: "auth/update/password",
        method: "PUT",
        body: { password, username },
        credentials: "include", //gets the username from the user and the cookies (register_user)
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useSendEmailConfirmationCodeMutation,
  useVerifyEmailConfirmationCodeMutation,
  useUpdatePasswordMutation,
} = authApi;
