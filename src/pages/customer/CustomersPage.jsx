import { lazy, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableSearch,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import { Button } from "@/components/ui/button";

import { useBoolean } from "@/hooks";
import {
  useDeleteCustomerMutation,
  useGetAllCustomerQuery,
} from "@/redux/features/customer/customerApi";

// LAZY IMPORT
const ConfirmDialog = lazy(() => import("@/components/shared/ConfirmDialog"));

const columns = [
  { key: "name", label: "Customer Name" },
  { key: "shopName", label: "Shop Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  {
    key: "totalPurchaseAmount",
    label: "Purchase",
    render: (row) => `${row.totalPurchaseAmount?.toFixed(0) ?? "0"} Tk`,
  },
  {
    key: "totalPaidAmount",
    label: "Paid",
    render: (row) => `${row.totalPaidAmount?.toFixed(0) ?? "0"} Tk`,
  },
  {
    key: "totalDue",
    label: "Due",
    render: (row) => `${row.totalDue?.toFixed(0) ?? "0"} Tk`,
  },
];

export default function CustomersPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const confirm = useBoolean();

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const rowsPerPage = 20;

  const { data: customerData, isLoading } = useGetAllCustomerQuery();

  const [deleteCustomer, { isLoading: deleteLoading }] =
    useDeleteCustomerMutation();

  const filtered = customerData?.data?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleEdit = (customer) => {
    navigate(`/edit-customer/${customer?.id}`);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    confirm.onTrue();
  };

  const handleDetails = (customer) => {
    navigate(`/customer-details/${customer?.id}`);
  };

  const confirmDelete = async () => {
    try {
      if (selectedCustomer?.totalDue > 0) {
        toast.error(
          `Cannot delete customer "${
            selectedCustomer?.name
          }" because he has an outstanding due of ${selectedCustomer?.totalDue?.toFixed(
            0
          )} Tk`
        );
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await deleteCustomer(selectedCustomer?.id).unwrap();

      if (result?.success) {
        toast.success(result.message || "Product deleted successfully");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      confirm.onFalse();

      setSelectedCustomer(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <CustomHeader
        title="Customers"
        subtitle="Manage your customer base"
        actions={
          <Link to="/add-customer">
            <Button className="custom-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={3} columns={columns} />
      ) : (
        <>
          {/* CUSTOMER TABLE */}
          <CustomTableSearch value={search} onChange={setSearch} />

          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
              onEdit={(row) => handleEdit(row)}
              onDelete={(row) => handleDelete(row)}
              onDetails={(row) => handleDetails(row)}
            />
          </CustomTableRoot>

          <CustomTablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {confirm.value && (
        <ConfirmDialog
          open={confirm.value}
          onOpenChange={confirm.onToggle}
          title="Delete Customer"
          description={`Are you sure you want to delete "${selectedCustomer?.name}"?`}
          onCancel={() => confirm.onFalse()}
          onConfirm={confirmDelete}
          isLoading={deleteLoading}
        />
      )}
    </>
  );
}
