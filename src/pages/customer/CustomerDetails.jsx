import {
  Banknote,
  BanknoteX,
  AlertCircle,
  BanknoteArrowDown,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useThemeContext } from "@/components/theme/ThemeProvider";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";

import { canManageEmployee } from "@/utils/role-utils";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetCustomerByIdQuery } from "@/redux/features/customer/customerApi";

import { StatCard } from "@/components/analytics/StatCard";

import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

const columns = [
  { key: "invoiceNumber", label: "Invoice number" },
  {
    key: "createdAt",
    label: "Date",
    render: (row) => {
      const date = new Date(row.createdAt);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
  {
    key: "issuedBy",
    label: "Created by",
    render: (row) => row?.issuedBy?.name,
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (row) => `${row.totalAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
  {
    key: "paidAmount",
    label: "Paid",
    render: (row) => `${row.paidAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
  {
    key: "dueAmount",
    label: "Due",
    render: (row) => `${row.dueAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
];

export default function CustomerDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { primaryColor } = useThemeContext();

  // CURRENT USER
  const currentUser = useSelector(useCurrentUser);

  // USER ROLE
  const userRole = currentUser?.user?.role;

  const isAuthorized = canManageEmployee(userRole);

  const { data: customerData, isLoading } = useGetCustomerByIdQuery(id, {
    skip: !id,
  });

  const invoiceData = customerData?.data?.invoices;

  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  const totalPages = Math.ceil(invoiceData?.length / rowsPerPage) || 1;

  const paginated = invoiceData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDetails = (invoice) => {
    navigate(`/invoice-details/${invoice?.id}`);
  };

  return (
    <>
      <CustomHeader
        title="Customer Details"
        subtitle={customerData ? `Details of ${customerData?.data?.name}` : ""}
      />

      {invoiceData?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total purchase"
            value={
              customerData?.data
                ? `${customerData?.data?.totalPurchaseAmount} Tk`
                : "0 Tk"
            }
            icon={<Banknote className="h-5 w-5" style={{ color: "green" }} />}
          />

          <StatCard
            title="Total paid"
            value={
              customerData?.data
                ? `${customerData?.data?.totalPaidAmount} Tk`
                : "0 Tk"
            }
            icon={
              <BanknoteArrowDown className="h-5 w-5" style={{ color: "red" }} />
            }
          />

          <StatCard
            title="Total due"
            value={
              customerData?.data ? `${customerData?.data?.totalDue} Tk` : "0 Tk"
            }
            icon={
              <BanknoteX className="h-5 w-5" style={{ color: "yellowgreen" }} />
            }
          />
        </div>
      )}

      {isLoading ? (
        <CircularLoading />
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: primaryColor }}>
              {customerData?.data?.name}
            </CardTitle>
            <CardDescription className="text-base">
              {customerData?.data?.phone}
            </CardDescription>

            <SelectSeparator />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-y-4">
              {customerData?.data?.name && (
                <DetailRow label="Name" value={customerData?.data?.name} />
              )}

              {customerData?.data?.shopName && (
                <DetailRow
                  label="Shop name"
                  value={customerData?.data?.shopName}
                />
              )}

              {customerData?.data?.email && (
                <DetailRow label="Email" value={customerData?.data?.email} />
              )}

              {customerData?.data?.phone && (
                <DetailRow label="Phone" value={customerData?.data?.phone} />
              )}

              {customerData?.data?.address && (
                <DetailRow
                  label="Address"
                  value={customerData?.data?.address}
                />
              )}

              {invoiceData ? (
                <>
                  <h2
                    className="mt-5 font-bold"
                    style={{ color: primaryColor }}
                  >
                    Invoices:
                  </h2>

                  {/* INVOICES TABLE */}
                  <CustomTableRoot>
                    <CustomTableHeader columns={columns} />

                    <CustomTableBody
                      data={paginated}
                      columns={columns}
                      onDetails={(row) => handleDetails(row)}
                    />
                  </CustomTableRoot>

                  {invoiceData?.length > 0 && (
                    <CustomTablePagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              ) : (
                <Alert className="text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-500">
                    There is no invoices for this customer!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          {isAuthorized && (
            <CardFooter className="d-flex justify-end">
              <Link to={`/edit-employee/${id}`}>
                <Button>Edit Customer</Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  );
}

// DETAILS ROW
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-y-1 sm:gap-x-2">
      <div className="min-w-[170px] font-medium text-muted-foreground">
        {label}:
      </div>
      <div className="text-primary break-words sm:break-normal">
        {value || "—"}
      </div>
    </div>
  );
}
