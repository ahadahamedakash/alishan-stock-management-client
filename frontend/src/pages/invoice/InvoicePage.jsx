import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CustomDateRangePicker from "@/components/date-picker/CustomDateRangePicker";

import { useGetAllInvoiceQuery } from "@/redux/features/invoice/invoiceApi";

const columns = [
  { key: "customerName", label: "Customer name" },
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
  { key: "issuedBy", label: "Created by" },
  {
    key: "totalAmount",
    label: "Total amount",
    render: (row) => `${row.totalAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
  {
    key: "paidAmount",
    label: "Total paid",
    render: (row) => `${row.paidAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
  {
    key: "dueAmount",
    label: "Total due",
    render: (row) => `${row.dueAmount?.toFixed(0) ?? "N/A"} Tk`,
  },
];

export default function InvoicePage() {
  const navigate = useNavigate();

  const [filterDates, setFilterDates] = useState({ from: null, to: null });

  const [search, setSearch] = useState("");

  const [inputValue, setInputValue] = useState("");

  const [fromDate, setFromDate] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  const { data: invoiceData, isLoading } = useGetAllInvoiceQuery({
    search,
    fromDate: filterDates.from || "",
    toDate: filterDates.to || "",
  });

  // Debounced setter for search value
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value.trim());
      }, 500),
    []
  );

  // Handle input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  // Cleanup debounce on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Automatically reset dates if search is active
  useEffect(() => {
    if (search.trim() !== "") {
      setFromDate("");
      setToDate("");
    }
  }, [search]);

  useEffect(() => {
    setToDate("");
  }, [fromDate]);

  const handleDateRangeChange = (range) => {
    setFilterDates(range);
  };

  const filtered = invoiceData?.data || [];

  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;
  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDetails = (invoice) => {
    const invoiceId = invoice?._id;

    navigate(`/invoice-details/${invoiceId}`);
  };

  return (
    <>
      <CustomHeader
        title="Invoices"
        subtitle="Manage your invoices"
        actions={
          <Link to="/add-invoice">
            <Button className="custom-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={rowsPerPage} columns={columns} />
      ) : (
        <>
          {/* TOP FILTER BAR */}
          <div className="grid grid-cols-12 gap-4 mb-6 px-1 items-center">
            {/* Search Input */}
            <div className="col-span-12 md:col-span-6">
              <Input
                type="search"
                placeholder="Search by customer name"
                value={inputValue}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            <div className="col-span-12 md:col-span-4 flex items-center gap-2">
              <CustomDateRangePicker
                fromDate={filterDates.from}
                toDate={filterDates.to}
                onChange={handleDateRangeChange}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="col-span-12 md:col-span-2">
              <Button
                variant="destructive"
                disabled={
                  search.trim() === "" &&
                  (!filterDates.from || filterDates.from === "") &&
                  (!filterDates.to || filterDates.to === "")
                }
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setFilterDates({ from: null, to: null });
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
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
    </>
  );
}
