import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CheckUsernameResponse {
  available: boolean;
  message?: string;
}

export const usernameApi = createApi({
  reducerPath: "usernameApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_USERNAME_CHECK_RUST_API_URL ||
      "http://127.0.0.1:43069/",
  }),
  tagTypes: ["Username"] as const,
  endpoints: (builder) => ({
    checkUsername: builder.query<CheckUsernameResponse, string>({
      query: (username) =>
        `check-username?username=${encodeURIComponent(username)}`,
      providesTags: (result, error, username) => [
        { type: "Username", id: username },
      ],
    }),
  }),
});

export const { useLazyCheckUsernameQuery } = usernameApi;
