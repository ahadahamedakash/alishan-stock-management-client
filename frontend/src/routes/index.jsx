import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Loader2 } from "lucide-react";

import Login from "@/pages/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// Wrapper for lazy loaded components
function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ANALYTICS PAGES (heavy - includes charts)
const Analytics = lazy(() => import("@/pages/Analytics"));

// PRODUCT PAGES
const ProductForm = lazy(() => import("@/pages/product/ProductForm"));
const ProductsPage = lazy(() => import("@/pages/product/ProductsPage"));

// CUSTOMER PAGES
const CustomerForm = lazy(() => import("@/pages/customer/CustomerForm"));
const CustomersPage = lazy(() => import("@/pages/customer/CustomersPage"));
const CustomerDetails = lazy(() => import("@/pages/customer/CustomerDetails"));

// INVOICE PAGES (heavy - includes PDF)
const InvoiceForm = lazy(() => import("@/pages/invoice/InvoiceForm"));
const InvoicePage = lazy(() => import("@/pages/invoice/InvoicePage"));
const InvoiceDetails = lazy(() => import("@/pages/invoice/InvoiceDetails"));

// STOCK PAGE
const StockPage = lazy(() => import("@/pages/stock/StockPage"));

// COLLECTION PAGE
const CollectionPage = lazy(() => import("@/pages/collection/CollectionPage"));

// EMPLOYEE PAGES
const EmployeePage = lazy(() => import("@/pages/employee/EmployeePage"));
const EmployeeForm = lazy(() => import("@/pages/employee/EmployeeForm"));
const EmployeeDetails = lazy(() => import("@/pages/employee/EmployeeDetails"));

// EXPENSE PAGES
const ExpenseForm = lazy(() => import("@/pages/expense/ExpenseForm"));
const ExpensePage = lazy(() => import("@/pages/expense/ExpensePage"));

// USER PAGES
const UserForm = lazy(() => import("@/pages/user/UserForm"));
const UsersPage = lazy(() => import("@/pages/user/UsersPage"));

// UNAUTHORIZED PAGE
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));

// PROFILE PAGE
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <Analytics />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      //  PRODUCT ROUTES
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={[
                "admin",
                "super_admin",
                "accountant",
                "stock_manager",
              ]}
            >
              <LazyPage>
                <ProductsPage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <ProductForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-product/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <ProductForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      //  USER ROUTES
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <UsersPage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-user",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <UserForm mode="create" />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-user/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <UserForm mode="edit" />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      //  CUSTOMER ROUTES
      {
        path: "customers",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <CustomersPage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-customer",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <CustomerForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-customer/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <CustomerForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "customer-details/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <CustomerDetails />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      //  EXPENSE ROUTES
      {
        path: "expenses",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <ExpensePage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-expense",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <ExpenseForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      //  EMPLOYEE ROUTES
      {
        path: "employees",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <EmployeePage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-employee",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <EmployeeForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-employee/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
              <LazyPage>
                <EmployeeForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "employee-details/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <EmployeeDetails />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // INVOICE ROUTES
      {
        path: "invoices",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <InvoicePage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-invoice",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <InvoiceForm />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // STOCK ROUTES
      {
        path: "stocks",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "stock_manager"]}
            >
              <LazyPage>
                <StockPage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // INVOICE ROUTES
      {
        path: "invoice-details",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <InvoiceDetails />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "invoice-details/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <InvoiceDetails />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // COLLECTION ROUTES
      {
        path: "collections",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={["admin", "super_admin", "accountant"]}
            >
              <LazyPage>
                <CollectionPage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // PROFILE ROUTES
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute
              allowedRoles={[
                "admin",
                "super_admin",
                "accountant",
                "stock_manager",
              ]}
            >
              <LazyPage>
                <ProfilePage />
              </LazyPage>
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      // UNAUTHORIZED ROUTE
      {
        path: "unauthorized",
        element: (
          <LazyPage>
            <Unauthorized />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/change-password",
    element: <Login />,
  },
]);
