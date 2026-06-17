import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_ALL_CUSTOMER,
        method: "GET",
      }),
      providesTags: ["CUSTOMERS"],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_CUSTOMER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),
    getCustomerById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.GET_CUSTOMER_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["CUSTOMERS"],
    }),
    updateCustomer: builder.mutation({
      query: ({ data, customerId }) => ({
        url: API_ENDPOINTS.UPDATE_CUSTOMER_BY_ID(customerId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),
    deleteCustomer: builder.mutation({
      query: (customerId) => ({
        url: API_ENDPOINTS.DELETE_CUSTOMER_BY_ID(customerId),
        method: "DELETE",
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
