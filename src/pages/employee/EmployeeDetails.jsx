import { useState } from "react";
import { useSelector } from "react-redux";
import { AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router";

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
import { useGetEmployeeByIdQuery } from "@/redux/features/employee/employeeApi";

import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";

const columns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },

  { key: "issuedBy", label: "Issued By", render: (row) => row?.issuedBy?.name },

  {
    key: "amount",
    label: "Amount",
    render: (row) => `${row?.amount?.toFixed(0) ?? "N/A"} Tk`,
  },
];

export default function EmployeeDetails() {
  const { id } = useParams();

  const { primaryColor } = useThemeContext();

  const { data: currentEmployee, isLoading } = useGetEmployeeByIdQuery(id);

  const employee = currentEmployee?.data;

  const salaryHistory = employee?.salaryHistory;

  const [page, setPage] = useState(1);

  const rowsPerPage = 24;

  // CURRENT USER
  const currentUser = useSelector(useCurrentUser);

  // USER ROLE
  const userRole = currentUser?.user?.role;

  const isAuthorized = canManageEmployee(userRole);

  const totalPages = Math.ceil(salaryHistory?.length / rowsPerPage) || 1;

  const paginated = salaryHistory?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!employee) {
    return <p className="text-center py-10">Employee not found.</p>;
  }

  return (
    <>
      <CustomHeader
        title="Employee Details"
        subtitle={`Details of ${employee?.name}`}
      />

      {isLoading ? (
        <CircularLoading />
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: primaryColor }}>
              {employee?.name}
            </CardTitle>
            <CardDescription className="text-base">
              {employee?.position &&
                employee.position
                  .replace(/_/g, " ")
                  .replace(/^./, (c) => c.toUpperCase())}
            </CardDescription>

            <SelectSeparator />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-y-4">
              {employee?.name && (
                <DetailRow label="Name" value={employee.name} />
              )}

              {employee?.email && (
                <DetailRow label="Email" value={employee.email} />
              )}

              {employee?.phone && (
                <DetailRow label="Phone" value={employee.phone} />
              )}

              {employee?.emergencyContact && (
                <DetailRow
                  label="Emergency Contact"
                  value={employee.emergencyContact}
                />
              )}

              {employee?.gender && (
                <DetailRow
                  label="Gender"
                  value={
                    employee.gender.charAt(0).toUpperCase() +
                    employee.gender.slice(1)
                  }
                />
              )}

              {employee?.dateOfBirth && (
                <DetailRow label="Date of Birth" value={employee.dateOfBirth} />
              )}

              {employee?.joiningDate && (
                <DetailRow label="Joining Date" value={employee.joiningDate} />
              )}

              {employee?.monthlySalary !== undefined && (
                <DetailRow
                  label="Monthly Salary"
                  value={`${employee.monthlySalary} Tk`}
                />
              )}

              {employee?.nidNumber && (
                <DetailRow label="NID Number" value={employee.nidNumber} />
              )}

              {employee?.presentAddress && (
                <DetailRow
                  label="Present Address"
                  value={employee.presentAddress}
                />
              )}

              {employee?.permanentAddress && (
                <DetailRow
                  label="Permanent Address"
                  value={employee.permanentAddress}
                />
              )}

              {employee?.position && (
                <DetailRow
                  label="Position"
                  value={employee.position
                    .replace(/_/g, " ")
                    .replace(/^./, (c) => c.toUpperCase())}
                />
              )}

              {employee?.salaryHistory ? (
                <>
                  <h2 className="mt-5" style={{ color: primaryColor }}>
                    Salary history:
                  </h2>

                  {/* EMPLOYEES SALARY TABLE */}
                  <CustomTableRoot>
                    <CustomTableHeader columns={columns} />

                    <CustomTableBody data={paginated} columns={columns} />
                  </CustomTableRoot>

                  {employee?.salaryHistory.length > 0 && (
                    <CustomTablePagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              ) : (
                !employee.salaryHistory && (
                  <Alert className="text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-500">
                      There is no salary history yet for this employee!
                    </AlertDescription>
                  </Alert>
                )
              )}
            </div>
          </CardContent>

          {isAuthorized && (
            <CardFooter className="d-flex justify-end">
              <Link to={`/edit-employee/${id}`}>
                <Button>Edit Employee</Button>
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
