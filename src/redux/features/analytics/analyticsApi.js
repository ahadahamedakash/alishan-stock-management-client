import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------
const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesSummary: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_SALES_SUMMARY,
        method: "GET",
      }),
      providesTags: ["ANALYTICS"],
    }),
    getMonthlySalesSummary: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_MONTHLY_SALES_SUMMARY,
        method: "GET",
      }),
      providesTags: ["ANALYTICS"],
    }),
    getRecentExpenses: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_RECENT_EXPENSES,
        method: "GET",
      }),
      providesTags: ["RECENT_EXPENSES"],
    }),
  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetRecentExpensesQuery,
  useGetMonthlySalesSummaryQuery,
} = analyticsApi;
