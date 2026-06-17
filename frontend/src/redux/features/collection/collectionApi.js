import { baseApi } from "@/redux/api/base-api";

import { API_ENDPOINTS } from "@/utils/api-endpoints";

// ----------------------------------------------------------------------

const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCollectionHistory: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_ALL_COLLECTION,
        method: "GET",
      }),
      providesTags: ["COLLECTIONS"],
    }),
    addCollection: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_COLLECTION,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CUSTOMERS", "BALANCES", "COLLECTIONS", "ANALYTICS"],
    }),
  }),
});

export const { useGetAllCollectionHistoryQuery, useAddCollectionMutation } =
  collectionApi;
