import { lazy, Suspense, useState } from "react";
import { Plus } from "lucide-react";
// import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";

import { useBoolean } from "@/hooks";

import {
  CustomTableBody,
  CustomTableHeader,
  CustomTablePagination,
  CustomTableRoot,
  CustomTableSearch,
} from "@/components/table";
import { Button } from "@/components/ui/button";

import { useGetAllUserQuery } from "@/redux/features/user/userApi";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

// LAZY IMPORT
const ResetUserDialog = lazy(() =>
  import("@/components/dialog/ResetUserDialog")
);

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  {
    key: "role",
    label: "Role",
    render: (row) => {
      switch (row.role) {
        case "super_admin":
          return "Super Admin";
        case "admin":
          return "Admin";
        case "accountant":
          return "Accountant";
        case "stock_manager":
          return "Stock Manager";
        default:
          return "";
      }
    },
  },
];

export default function UsersPage() {
  const navigate = useNavigate();

  const confirmReset = useBoolean();

  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  const { data: userData, isLoading } = useGetAllUserQuery();

  const filtered = userData?.data?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleEdit = (user) => {
    navigate(`/edit-user/${user?.id}`);
  };

  // const handleDelete = (user) => {
  //   toast.success(`User deleted: ${user?.name}`);
  // };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    confirmReset.onTrue();
  };

  return (
    <>
      <CustomHeader
        title="Users"
        subtitle="Manage system users and their roles"
        actions={
          <Link to="/add-user">
            <Button className="custom-button">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={5} columns={columns} />
      ) : (
        <>
          {/* USER TABLE */}
          <CustomTableSearch value={search} onChange={setSearch} />

          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
              onEdit={(row) => handleEdit(row)}
              // onDelete={(row) => handleDelete(row)}
              actions={(row) => (
                <Button
                  size="sm"
                  className="rounded-full"
                  variant="destructive"
                  onClick={() => handleResetPassword(row)}
                >
                  Reset
                </Button>
              )}
            />
          </CustomTableRoot>

          <CustomTablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* RESET USERS DIALOG */}
      {confirmReset.value && (
        <Suspense fallback={<CircularLoading />}>
          <ResetUserDialog openDialog={confirmReset} userData={selectedUser} />
        </Suspense>
      )}
    </>
  );
}
