import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------
const balanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_BALANCE,
        method: "GET",
      }),
      providesTags: ["BALANCES"],
    }),
  }),
});

export const { useGetBalanceQuery } = balanceApi;
