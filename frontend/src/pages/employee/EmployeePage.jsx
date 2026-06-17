import { lazy, Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useBoolean } from "@/hooks";

import {
  CustomTableRoot,
  CustomTableBody,
  CustomTableSearch,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import { Button } from "@/components/ui/button";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";

import {
  useGetAllEmployeeQuery,
  useDeleteEmployeeMutation,
} from "@/redux/features/employee/employeeApi";
import { canManageEmployee } from "@/utils/role-utils";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import CircularLoading from "@/components/shared/CircularLoading";

// LAZY IMPORT
const ConfirmDialog = lazy(() => import("@/components/shared/ConfirmDialog"));

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "email" },
  { key: "phone", label: "Phone" },
  { key: "emergencyContact", label: "Emergency No." },
  {
    key: "position",
    label: "Position",
    render: (row) =>
      row.position.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()),
  },
  { key: "joiningDate", label: "Joining Date" },
  {
    key: "monthlySalary",
    label: "Salary",
    render: (row) => `${row?.monthlySalary?.toFixed(0) ?? "N/A"} Tk`,
  },
];

export default function EmployeePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const confirm = useBoolean();

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const rowsPerPage = 20;

  // CURRENT USER
  const currentUser = useSelector(useCurrentUser);

  // USER ROLE
  const userRole = currentUser?.user?.role;

  const isAuthorized = canManageEmployee(userRole);

  const { data: employeeData, isLoading } = useGetAllEmployeeQuery();

  const [deleteEmployee, { isLoading: deleteLoading }] =
    useDeleteEmployeeMutation();

  const filtered = employeeData?.data?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleEdit = (employee) => {
    navigate(`/edit-employee/${employee?.id}`);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    confirm.onTrue();
  };

  const handleDetails = (employee) => {
    navigate(`/employee-details/${employee?.id}`);
  };

  const confirmDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await deleteEmployee(selectedEmployee?.id).unwrap();

      if (result?.success) {
        toast.success(result.message || "Employee deleted successfully");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      confirm.onFalse();

      setSelectedEmployee(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <>
      <CustomHeader
        title="Employees"
        subtitle="Manage your workforce and their details"
        actions={
          isAuthorized && (
            <Link to="/add-employee">
              <Button className="custom-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </Link>
          )
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={5} columns={columns} />
      ) : (
        <>
          {/* EMPLOYEE TABLE */}
          <CustomTableSearch value={search} onChange={setSearch} />

          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
              onEdit={isAuthorized ? (row) => handleEdit(row) : undefined}
              onDelete={isAuthorized ? (row) => handleDelete(row) : undefined}
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
        <Suspense fallback={<CircularLoading />}>
          <ConfirmDialog
            open={confirm.value}
            onOpenChange={confirm.onToggle}
            title="Delete Employee"
            description={`Are you sure you want to delete "${selectedEmployee?.name}"?`}
            onCancel={() => confirm.onFalse()}
            onConfirm={confirmDelete}
            isLoading={deleteLoading}
          />
        </Suspense>
      )}
    </>
  );
}
