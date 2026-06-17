import { baseApi } from "@/redux/api/base-api";
import { API_ENDPOINTS } from "@/utils/api-endpoints";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployee: builder.query({
      query: () => ({
        url: API_ENDPOINTS.GET_ALL_EMPLOYEE,
        method: "GET",
      }),
      providesTags: ["EMPLOYEES"],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.CREATE_EMPLOYEE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({
        url: API_ENDPOINTS.GET_EMPLOYEE_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["EMPLOYEES"],
    }),
    updateEmployee: builder.mutation({
      query: ({ data, employeeId }) => ({
        url: API_ENDPOINTS.UPDATE_EMPLOYEE_BY_ID(employeeId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    deleteEmployee: builder.mutation({
      query: (employeeId) => ({
        url: API_ENDPOINTS.DELETE_EMPLOYEE_BY_ID(employeeId),
        method: "DELETE",
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
  }),
});

export const {
  useGetAllEmployeeQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
} = employeeApi;
