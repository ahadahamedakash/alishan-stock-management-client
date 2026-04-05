import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";
import CustomDateRangePicker from "@/components/date-picker/CustomDateRangePicker";

import { useGetAllExpenseQuery } from "@/redux/features/expense/expenseApi";

import { EXPENSE_OPTIONS } from "@/constants";

const columns = [
  { key: "date", label: "Date" },
  {
    key: "category",
    label: "Category",
    render: (row) =>
      row.category.charAt(0).toUpperCase() + row.category.slice(1),
  },
  { key: "description", label: "Description" },
  {
    key: "issuedBy",
    label: "Issued By",
    render: (row) => row.issuedBy?.name || "N/A",
  },
  {
    key: "amount",
    label: "Amount",
    render: (row) => `${row.amount?.toFixed(0) ?? "N/A"} Tk`,
  },
];

export default function ExpensePage() {
  const navigate = useNavigate();

  const [filterDates, setFilterDates] = useState({ from: null, to: null });

  const [search, setSearch] = useState("");

  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  const { data: expenseHistory, isLoading } = useGetAllExpenseQuery({
    search,
    fromDate: filterDates.from || "",
    toDate: filterDates.to || "",
    // category
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

  const filtered = expenseHistory?.data || [];

  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // eslint-disable-next-line no-unused-vars
  const handleEdit = (expense) => {
    navigate(`/edit-expense/${expense?.id}`);
  };

  const handleSelect = (category) => {
    navigate(`/add-expense?category=${category}`);
  };

  return (
    <>
      <CustomHeader
        title="Expenses"
        subtitle="Track and manage your business expenses"
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button className="custom-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                {EXPENSE_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
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
                placeholder="Search by description & amount..."
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

          {/* EXPENSE TABLE */}
          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
              // onEdit={(row) => handleEdit(row)}
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
