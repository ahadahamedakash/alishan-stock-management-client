import { debounce } from "lodash";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { useState, useCallback } from "react";

import { useThemeContext } from "../theme/ThemeProvider";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useDeductStockMutation } from "@/redux/features/stock/stockApi";
import { useGetAllInvoiceQuery } from "@/redux/features/invoice/invoiceApi";
import { useGetAllProductQuery } from "@/redux/features/product/productApi";

export default function DeductStockDialog({ isDeductStockOpen }) {
  const { primaryColor } = useThemeContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [submittedInvoiceNumber, setSubmittedInvoiceNumber] = useState("");

  const [isConfirmedView, setIsConfirmedView] = useState(false);

  const [deductStock] = useDeductStockMutation();

  // Debounced invoice number set
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetInvoice = useCallback(
    debounce((val) => {
      setSubmittedInvoiceNumber(val);
    }, 400),
    []
  );

  // Trigger invoice fetch on form submit
  const handleSubmit = () => {
    if (!invoiceNumber.trim()) {
      toast.error("Please enter an invoice number.");
      return;
    }
    debouncedSetInvoice(invoiceNumber.trim());
  };

  // Fetch invoice
  const {
    data: invoiceData,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
    error: invoiceError,
    refetch: refetchInvoice,
    isFetching: isInvoiceFetching,
  } = useGetAllInvoiceQuery(
    { invoiceNumber: submittedInvoiceNumber },
    {
      skip: !submittedInvoiceNumber || !isDeductStockOpen.value,
    }
  );

  const invoice = invoiceData?.data?.[0];

  // Fetch products only if we have a valid invoice
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
    refetch: refetchProduct,
  } = useGetAllProductQuery(undefined, {
    skip: !invoice || !invoice?.products?.length,
  });

  // Confirm deduct action
  const handleConfirmDeduction = async () => {
    setIsSubmitting(true);

    try {
      const res = await deductStock({
        invoiceNumber: submittedInvoiceNumber,
      }).unwrap();

      console.log("result", res);

      toast.success("Stock deducted successfully.");

      closeDialog();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to deduct stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setInvoiceNumber("");
    setSubmittedInvoiceNumber("");
    setIsConfirmedView(false);
    isDeductStockOpen.onFalse();

    // Clear cached data by tricking skip and using refetch
    setTimeout(() => {
      refetchInvoice();
      refetchProduct();
    }, 0);
  };

  const handleCancel = () => {
    setInvoiceNumber("");
    setIsConfirmedView(false);
    setSubmittedInvoiceNumber("");

    setTimeout(() => {
      refetchInvoice();
      refetchProduct();
    }, 0);
  };

  // Error UI (robust feedback)
  const renderErrors = () => {
    if (isInvoiceError) {
      return (
        <p className="text-sm text-red-500">
          {invoiceError?.data?.message || "Failed to fetch invoice"}
        </p>
      );
    }
    if (isProductError) {
      return (
        <p className="text-sm text-red-500">
          {productError?.data?.message || "Failed to fetch product data"}
        </p>
      );
    }
    return null;
  };

  return (
    <Dialog
      open={isDeductStockOpen.value}
      // onOpenChange={isDeductStockOpen.onToggle}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deduct Stock</DialogTitle>
          <DialogClose
            onClick={closeDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:ring-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {!invoice || !invoice?.products || !productData || !isConfirmedView ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2 mb-5">
              <Label>Invoice Number</Label>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. 00001"
              />
            </div>
            {renderErrors()}
            <Button
              disabled={isInvoiceLoading || isProductLoading}
              className="w-full bg-[#B38A2D] hover:bg-[#E1BE5D]"
              onClick={() => {
                handleSubmit();
                setIsConfirmedView(true);
              }}
            >
              {isInvoiceLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <h4 className="text-lg font-semibold">Invoice Products</h4>
            <div className="border rounded-md">
              {isInvoiceFetching || isInvoiceLoading ? (
                <div className="flex justify-center items-center my-3">
                  <Loader2
                    className="w-12 h-12 animate-spin"
                    style={{ color: primaryColor }}
                  />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-center">
                      <th className="p-2">Product</th>

                      <th className="p-2">Quantity</th>

                      {/* <th className="p-2">Price</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.products?.map((prod, index) => {
                      const productInfo = productData?.data?.find(
                        (p) => p._id === prod.productId
                      );

                      return (
                        <tr key={index} className="border-t text-center">
                          <td className="p-2">
                            {productInfo?.name || "Unknown"}
                          </td>

                          <td className="p-2">{prod.quantity}</td>

                          {/* <td className="p-2">
                          {prod.price} Tk
                        </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button onClick={handleCancel}>Cancel</Button>

              <Button
                disabled={isProductLoading || isSubmitting}
                onClick={handleConfirmDeduction}
                className=" bg-red-600 hover:bg-red-700 text-white"
              >
                {isProductLoading
                  ? "Loading Products..."
                  : isSubmitting
                  ? "Submitting..."
                  : "Confirm Stock Deduction"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
