import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStockHistory: builder.query({
      query: (args = {}) => {
        const { search, fromDate, toDate } = args;

        const params = {};
        if (search?.trim()) params.search = search.trim();
        if (fromDate && toDate) {
          params.fromDate = fromDate;
          params.toDate = toDate;
        }

        return {
          url: API_ENDPOINTS.GET_ALL_STOCK_HISTORY,
          method: "GET",
          params,
        };
      },
      providesTags: ["STOCKS"],
    }),

    addStock: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.ADD_STOCK,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["STOCKS", "PRODUCTS", "INVOICES"],
    }),

    deductStock: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.DEDUCT_STOCK,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["STOCKS", "PRODUCTS", "INVOICES"],
    }),
  }),
});

export const {
  useAddStockMutation,
  useDeductStockMutation,
  useGetAllStockHistoryQuery,
} = stockApi;
