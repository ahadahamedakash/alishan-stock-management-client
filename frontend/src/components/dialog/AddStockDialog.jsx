import * as Yup from "yup";
import { useMemo } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";

import { RHFInput, RHFSelect } from "../form";

import { useGetAllProductQuery } from "@/redux/features/product/productApi";
import { useAddStockMutation } from "@/redux/features/stock/stockApi";

const ProductSchema = Yup.object().shape({
  productId: Yup.string().trim().required("Product is required"),

  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1")
    .integer("Quantity must be a whole number"),
});

export default function AddStockDialog({ stockInModal }) {
  const { data: productData, isSuccess } = useGetAllProductQuery({
    skip: !stockInModal.value,
  });

  const [addStock, { _isLoading }] = useAddStockMutation();

  const productOptions = useMemo(() => {
    if (!isSuccess || !Array.isArray(productData?.data)) return [];
    return productData.data.map((product) => ({
      value: product._id,
      label: product.name,
    }));
  }, [isSuccess, productData]);

  const defaultValues = {
    productId: "",
    quantity: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("FORM DATA: ", data);

      const result = await addStock(data).unwrap();
      console.log("result: ", result);

      if (result.success) {
        toast.success(result.message || "Product updated successfully");

        stockInModal.onFalse();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog open={stockInModal.value} onOpenChange={stockInModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => {
              stockInModal.onFalse();
              reset();
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <RHFSelect
              name="productId"
              label="Select product *"
              placeholder="Select product"
              options={productOptions?.map(({ value, label }) => ({
                value,
                label,
              }))}
            />

            <RHFInput
              name="quantity"
              label="Quantity *"
              type="number"
              placeholder="Enter product quantity"
            />

            <Button
              type="submit"
              variant="success"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Stock"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
