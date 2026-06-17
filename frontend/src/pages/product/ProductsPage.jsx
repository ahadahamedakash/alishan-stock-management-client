import { lazy, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useBoolean } from "@/hooks";

import {
  CustomTableBody,
  CustomTableRoot,
  CustomTableHeader,
  CustomTableSearch,
  CustomTablePagination,
} from "@/components/table";
import { Button } from "@/components/ui/button";

import TableSkeleton from "@/components/skeleton/table-skeleton";
import CustomHeader from "@/components/page-heading/CustomHeader";
import ProductImageWithSkeleton from "@/components/skeleton/product-loading-skeleton";

import {
  useGetAllProductQuery,
  useDeleteProductMutation,
} from "@/redux/features/product/productApi";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

import { canManageProduct } from "@/utils/role-utils";

const ConfirmDialog = lazy(() => import("@/components/shared/ConfirmDialog"));

const columns = [
  {
    key: "image",
    label: "Image",
    render: (row) => (
      <ProductImageWithSkeleton src={row.image} alt={row.name} />
    ),
  },
  { key: "name", label: "Product Name" },
  { key: "sku", label: "SKU" },
  {
    key: "price",
    label: "Price",
    render: (row) => `${row.price?.toFixed(0) ?? "N/A"} Tk`,
  },
  { key: "reserved", label: "Reserved", align: "center" },
  { key: "stock", label: "Stock", align: "center" },
];

export default function ProductsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const confirm = useBoolean();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const rowsPerPage = 20;

  // CURRENT USER
  const currentUser = useSelector(useCurrentUser);

  // USER ROLE
  const userRole = currentUser?.user?.role;

  const isAuthorized = canManageProduct(userRole);

  const { data: productData, isLoading } = useGetAllProductQuery();

  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  const filtered = productData?.data?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered?.length / rowsPerPage) || 1;

  const paginated = filtered?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleEdit = (product) => {
    navigate(`/edit-product/${product?.id}`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    confirm.onTrue();
  };

  const confirmDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await deleteProduct(selectedProduct?.id).unwrap();

      if (result?.success) {
        toast.success(result.message || "Product deleted successfully");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      confirm.onFalse();

      setSelectedProduct(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <CustomHeader
        title="Products"
        subtitle="Manage your products"
        actions={
          isAuthorized && (
            <Link to="/add-product">
              <Button className="custom-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          )
        }
      />

      {isLoading ? (
        <TableSkeleton numRows={3} columns={columns} />
      ) : (
        <>
          {/* PRODUCT TABLE */}
          <CustomTableSearch value={search} onChange={setSearch} />

          <CustomTableRoot>
            <CustomTableHeader columns={columns} />

            <CustomTableBody
              data={paginated}
              columns={columns}
              onEdit={isAuthorized ? (row) => handleEdit(row) : undefined}
              onDelete={isAuthorized ? (row) => handleDelete(row) : undefined}
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
          title="Delete Product"
          description={`Are you sure you want to delete "${selectedProduct?.name}"?`}
          onCancel={() => confirm.onFalse()}
          onConfirm={confirmDelete}
          isLoading={deleteLoading}
        />
      )}
    </>
  );
}
