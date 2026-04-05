import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExpense: builder.query({
      query: (args = {}) => {
        const { search, fromDate, toDate, category } = args;

        const params = {};
        if (search?.trim()) params.search = search.trim();
        if (category?.trim()) params.search = search.trim();
        if (fromDate && toDate) {
          params.fromDate = fromDate;
          params.toDate = toDate;
        }

        return {
          url: API_ENDPOINTS.GET_ALL_EXPENSE,
          method: "GET",
          params,
        };
      },

      providesTags: ["EXPENSES"],
    }),
    createExpense: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_EXPENSE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EXPENSES", "BALANCES", "RECENT_EXPENSES"],
    }),
    getExpenseById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.GET_EXPENSE_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["EXPENSES"],
    }),
    updateExpense: builder.mutation({
      query: ({ data, productId }) => ({
        url: API_ENDPOINTS.UPDATE_EXPENSE_BY_ID(productId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["EXPENSES", "BALANCES", "RECENT_EXPENSES"],
    }),
    deleteExpense: builder.mutation({
      query: (productId) => ({
        url: API_ENDPOINTS.DELETE_EXPENSE_BY_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["EXPENSES", "BALANCES", "EXPENSES"],
    }),
  }),
});

export const {
  useGetAllExpenseQuery,
  useGetExpenseByIdQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useCreateExpenseMutation,
} = expenseApi;
