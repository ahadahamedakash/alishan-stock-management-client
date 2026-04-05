import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_ALL_PRODUCT,
        method: "GET",
      }),
      providesTags: ["PRODUCTS"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_PRODUCT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.GET_PRODUCT_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["PRODUCTS"],
    }),
    updateProduct: builder.mutation({
      query: ({ data, productId }) => ({
        url: API_ENDPOINTS.UPDATE_PRODUCT_BY_ID(productId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: API_ENDPOINTS.DELETE_PRODUCT_BY_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
} = productApi;
