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

import { RHFInput, RHFSelect, RHFTextArea } from "../form";

import { PAYMENT_OPTIONS } from "@/constants";

import { useThemeContext } from "../theme/ThemeProvider";
import { useGetAllCustomerQuery } from "@/redux/features/customer/customerApi";
import { useAddCollectionMutation } from "@/redux/features/collection/collectionApi";

const CollectionSchema = Yup.object().shape({
  customerId: Yup.string().trim().required("Customer is required"),

  method: Yup.string()
    .trim()
    .required("Please select a payment method")
    .notOneOf([""], "Please select a payment method"),

  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount must be at least 1")
    .integer("Amount must be a whole number"),

  description: Yup.string().trim(),
});

export default function CollectionDialog({ collectionDialog }) {
  const { primaryColor } = useThemeContext();

  const { data: customerData, isSuccess } = useGetAllCustomerQuery({
    skip: !collectionDialog.value,
  });

  const [addCollection, { _isLoading }] = useAddCollectionMutation();

  const customerOptions = useMemo(() => {
    if (!isSuccess || !Array.isArray(customerData?.data)) return [];
    return customerData.data.map((customer) => ({
      value: customer._id,
      label: customer.name,
    }));
  }, [isSuccess, customerData]);

  const defaultValues = {
    customerId: "",
    method: "",
    amount: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(CollectionSchema),
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

      // console.log("FORM DATA: ", data);

      const result = await addCollection(data).unwrap();
      // console.log("result: ", result);

      if (result.success) {
        toast.success(result.message || "Collection added successfully");

        await new Promise((resolve) => setTimeout(resolve, 200));

        collectionDialog.onFalse();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog
      open={collectionDialog.value}
      onOpenChange={collectionDialog.onToggle}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ color: primaryColor }}>
            Add Collection
          </DialogTitle>
          <DialogClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => {
              collectionDialog.onFalse();
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
              name="customerId"
              label="Select customer *"
              placeholder="Select customer"
              options={customerOptions?.map(({ value, label }) => ({
                value,
                label,
              }))}
            />

            <RHFSelect
              name="method"
              label="Select payment method *"
              placeholder="Select payment method"
              options={PAYMENT_OPTIONS}
            />

            <RHFInput
              name="amount"
              label="Amount *"
              type="number"
              placeholder="Enter product amount"
            />

            <RHFTextArea
              name="description"
              label="Description (optional)"
              placeholder="Enter description"
            />

            <Button
              type="submit"
              variant="success"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Collection"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
