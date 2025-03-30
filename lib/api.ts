import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}


interface PurchaseCode {
  code: string;
  isUsed: boolean;
}

interface TokensResponse {
  purchaseCodes: PurchaseCode[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500/api";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const auth = localStorage.getItem("auth");
      if (auth) {
        const { token } = JSON.parse(auth);
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => "entrytest/topics",
      transformResponse: (response: ApiResponse<TokensResponse>) => response.data || [],
    }),
    verifyPurchaseCode: builder.mutation({
      query: ({ code }) => ({
        url: `entrytest/validate-code`,
        method: "POST",
        body: { code },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "admin/sign-in",
        method: "POST",
        body: { email, password },
      }),
    }),
    generateToken: builder.mutation({
      query: () => ({
        url: "admin/generate-code",
        method: "POST",
      }),
    }),
    getTokens: builder.query({
      query: () => "admin/codes",
      transformResponse: (response: ApiResponse<TokensResponse>) => response.data || [],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useVerifyPurchaseCodeMutation,
  useLoginMutation,
  useGenerateTokenMutation,
  useGetTokensQuery,
} = quizApi;
