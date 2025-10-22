import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_JAVA_API_BASE_URL,
  }),
  tagTypes: ["Users"] as const,
  endpoints: () => ({}),
});
