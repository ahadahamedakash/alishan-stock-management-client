import { debounce } from "lodash";
import { Plus, Minus } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { useBoolean } from "@/hooks";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useGetAllStockHistoryQuery } from "@/redux/features/stock/stockApi";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CircularLoading from "@/components/shared/CircularLoading";
import CustomDateRangePicker from "@/components/date-picker/CustomDateRangePicker";

// LAZY IMPORTS
const AddStockDialog = lazy(() => import("@/components/dialog/AddStockDialog"));
const DeductStockDialog = lazy(() =>
  import("@/components/dialog/DeductStockDialog")
);

const columns = [
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
  { key: "product", label: "Product", render: (row) => row.productId?.name },
  {
    key: "type",
    label: "Status",
    align: "center",
    render: (row) => (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          row?.status === "in"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {row?.status === "in" ? "Added" : "Deducted"}
      </span>
    ),
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
  },
  {
    key: "issuesBy",
    label: "Issued by",
    render: (row) => row.issuedBy?.name,
  },
];

export default function StockPage() {
  const [filterDates, setFilterDates] = useState({ from: null, to: null });

  const [search, setSearch] = useState("");

  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(1);

  const stockInModal = useBoolean();

  const stockOutModal = useBoolean();

  const rowsPerPage = 20;

  const { data: stockHistory, isLoading } = useGetAllStockHistoryQuery({
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
      setFilterDates({ from: null, to: null });
    }
  }, [search]);

  useEffect(() => {
    setFilterDates((prev) => ({
      ...prev,
      to: null,
    }));
    setSearch("");
    setInputValue("");
  }, [filterDates.from]);

  const handleDateRangeChange = (range) => {
    setFilterDates(range);
  };

  const filtered = stockHistory?.data || [];

  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <CustomHeader
        title="Stock Management"
        subtitle="Manage your product inventory levels"
        actions={
          <div className="flex gap-2">
            <Button variant="destructive" onClick={stockOutModal.onTrue}>
              <Minus className="mr-2 h-4 w-4" />
              Deduct Stock
            </Button>
            <Button variant="success" onClick={stockInModal.onTrue}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        }
      />

      {/* Stock History Table */}
      {isLoading ? (
        <TableSkeleton columns={columns} numRows={rowsPerPage} />
      ) : (
        <>
          {/* TOP FILTER BAR */}
          <div className="grid grid-cols-12 gap-4 mb-6 px-1 items-center">
            {/* Search Input */}
            <div className="col-span-12 md:col-span-6">
              <Input
                type="search"
                placeholder="Search by product"
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
                  inputValue.trim() === "" &&
                  (!filterDates.from || filterDates.from === "") &&
                  (!filterDates.to || filterDates.to === "")
                }
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setInputValue(""), setFilterDates({ from: null, to: null });
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

            <CustomTableBody data={paginated} columns={columns} />
          </CustomTableRoot>

          <CustomTablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Add Stock Dialog */}
      {stockInModal.value && (
        <Suspense fallback={<CircularLoading />}>
          <AddStockDialog stockInModal={stockInModal} />
        </Suspense>
      )}

      {/* Deduct Stock Dialog */}

      {stockOutModal.value && (
        <Suspense fallback={<CircularLoading />}>
          <DeductStockDialog isDeductStockOpen={stockOutModal} />
        </Suspense>
      )}
    </>
  );
}
