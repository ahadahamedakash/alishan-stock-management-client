// ------------------------------------------------------------

// FOR DEVELOPMENT
// export const API_BASE_URL = "http://localhost:5000/api/v1";

// FOR PRODUCTION ( RENDER - DEPLOYMENT )
export const API_BASE_URL =
  "https://alishan-stock-management-server.onrender.com/api/v1";

export const API_ENDPOINTS = {
  //  AUTH APIS
  LOGIN: `/auth/login`,
  CHANGE_PASSWORD: `/auth/change-password`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,

  // USERS APIS
  RESET_USER: `/users/reset-user`,
  CREATE_USER: `/users/create-user`,
  GET_ALL_USER: `/users/get-all-user`,
  GET_USER_BY_ID: (id) => `/users/get-single-user/${id}`,
  UPDATE_USER_BY_ID: (id) => `${API_BASE_URL}/users/update-user/${id}`,
  DELETE_USER_BY_ID: (id) => `${API_BASE_URL}/users/delete-user/${id}`,

  // PRODUCTS APIS
  CREATE_PRODUCT: `/products/create-product`,
  GET_ALL_PRODUCT: `/products/get-all-product`,
  GET_PRODUCT_BY_ID: (id) => `/products/get-single-product/${id}`,
  UPDATE_PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/edit-product/${id}`,
  DELETE_PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/delete-product/${id}`,

  // CUSTOMERS APIS
  CREATE_CUSTOMER: `/customers/create-customer`,
  GET_ALL_CUSTOMER: `/customers/get-all-customer`,
  GET_CUSTOMER_BY_ID: (id) => `/customers/get-single-customer/${id}`,
  UPDATE_CUSTOMER_BY_ID: (id) =>
    `${API_BASE_URL}/customers/edit-customer/${id}`,
  DELETE_CUSTOMER_BY_ID: (id) =>
    `${API_BASE_URL}/customers/delete-customer/${id}`,

  // EMPLOYEES APIS
  CREATE_EMPLOYEE: `/employees/create-employee`,
  GET_ALL_EMPLOYEE: `/employees/get-all-employee`,
  GET_EMPLOYEE_BY_ID: (id) => `/employees/get-single-employee/${id}`,
  UPDATE_EMPLOYEE_BY_ID: (id) =>
    `${API_BASE_URL}/employees/update-employee/${id}`,
  DELETE_EMPLOYEE_BY_ID: (id) =>
    `${API_BASE_URL}/employees/delete-employee/${id}`,

  // INVOICES APIS
  CREATE_INVOICE: `/invoices/create-invoice`,
  GET_ALL_INVOICE: `/invoices/get-all-invoice`,
  GET_INVOICE_BY_ID: (id) => `/invoices/get-single-invoice/${id}`,
  UPDATE_INVOICE_BY_ID: (id) => `${API_BASE_URL}/invoices/edit-invoice/${id}`,
  DELETE_INVOICE_BY_ID: (id) => `${API_BASE_URL}/invoices/delete-invoice/${id}`,

  // STOCK APIS
  ADD_STOCK: `/stocks/add-stock`,
  DEDUCT_STOCK: `/stocks/deduct-stock`,
  GET_ALL_STOCK_HISTORY: `/stocks/stock-history`,

  // EXPENSES APIS
  CREATE_EXPENSE: `/expenses/add-expense`,
  GET_ALL_EXPENSE: `/expenses/get-all-expense`,
  GET_EXPENSE_BY_ID: (id) => `/expenses/get-single-expense/${id}`,
  UPDATE_EXPENSE_BY_ID: (id) => `${API_BASE_URL}/expenses/edit-expense/${id}`,
  DELETE_EXPENSE_BY_ID: (id) => `${API_BASE_URL}/expenses/delete-expense/${id}`,

  // BALANCES APIS
  GET_BALANCE: `/balances/get-balance`,

  // COLLECTIONS APIS
  CREATE_COLLECTION: `/collections/create-collection`,
  GET_ALL_COLLECTION: `/collections/get-collection-history`,

  // ANALYTICS APIS
  GET_SALES_SUMMARY: `/analytics/sales-summary`,
  GET_MONTHLY_SALES_SUMMARY: `/analytics/monthly-sales-summary`,
  GET_RECENT_EXPENSES: `/analytics/recent-expenses`,

  //
  //
};
