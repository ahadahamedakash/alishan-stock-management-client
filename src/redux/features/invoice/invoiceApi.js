import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInvoice: builder.query({
      query: (args = {}) => {
        const { search, fromDate, toDate, invoiceNumber } = args;

        const params = {};
        if (search?.trim()) params.search = search.trim();
        if (invoiceNumber?.trim()) params.invoiceNumber = invoiceNumber.trim();
        if (fromDate && toDate) {
          params.fromDate = fromDate;
          params.toDate = toDate;
        }

        return {
          url: API_ENDPOINTS.GET_ALL_INVOICE,
          method: "GET",
          params,
        };
      },
      providesTags: ["INVOICES"],
    }),

    createInvoice: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_INVOICE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "INVOICES",
        "CUSTOMERS",
        "BALANCES",
        "PRODUCTS",
        "ANALYTICS",
      ],
    }),
    getInvoiceById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.GET_INVOICE_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["INVOICES"],
    }),
    updateInvoice: builder.mutation({
      query: ({ data, invoiceId }) => ({
        url: API_ENDPOINTS.UPDATE_INVOICE_BY_ID(invoiceId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        "INVOICES",
        "CUSTOMERS",
        "BALANCES",
        "PRODUCTS",
        "ANALYTICS",
      ],
    }),
    deleteInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: API_ENDPOINTS.DELETE_INVOICE_BY_ID(invoiceId),
        method: "DELETE",
      }),
      invalidatesTags: [
        "INVOICES",
        "CUSTOMERS",
        "BALANCES",
        "PRODUCTS",
        "ANALYTICS",
      ],
    }),
  }),
});

export const {
  useGetAllInvoiceQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
