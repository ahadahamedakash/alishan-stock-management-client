import { lazy, Suspense, useState } from "react";
import { Plus } from "lucide-react";

import { useBoolean } from "@/hooks";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableSearch,
  CustomTableHeader,
  CustomTablePagination,
} from "@/components/table";
import { Button } from "@/components/ui/button";

import { useGetAllCollectionHistoryQuery } from "@/redux/features/collection/collectionApi";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";

const CollectionDialog = lazy(() =>
  import("@/components/collection/CollectionDialog")
);

const columns = [
  {
    key: "name",
    label: "Customer name",
    render: (row) => row?.customerId?.name,
  },

  {
    key: "method",
    label: "Payment method",
    render: (row) => {
      switch (row.method) {
        case "cash":
          return "Cash";
        case "cheque":
          return "Cheque";
        case "bank_transfer":
          return "Bank tranfer";
        case "mobile_banking":
          return "Mobile banking";
        default:
          return "";
      }
    },
  },
  {
    key: "issuedBy",
    label: "Collected by",
    render: (row) => row?.issuedBy?.name,
  },
  {
    key: "amount",
    label: "Amount",
    render: (row) => row.amount,
  },
];

export default function CollectionPage() {
  const collectionDialog = useBoolean();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const rowsPerPage = 20;

  const { data: collectionData, isLoading } = useGetAllCollectionHistoryQuery();

  const filtered = collectionData?.data?.filter((d) =>
    d.customerId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <CustomHeader
        title="Collections"
        subtitle="Manage your customers due amount and histories"
        actions={
          <Button className="custom-button" onClick={collectionDialog.onTrue}>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={3} columns={columns} />
      ) : (
        <>
          {/* USER TABLE */}
          <CustomTableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by customer name..."
          />

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

      {/* COLLECTION DIALOG */}
      {collectionDialog.value && (
        <Suspense fallback={null}>
          <CollectionDialog collectionDialog={collectionDialog} />
        </Suspense>
      )}
    </>
  );
}
