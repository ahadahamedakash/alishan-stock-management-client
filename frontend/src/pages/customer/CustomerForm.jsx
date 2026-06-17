import * as Yup from "yup";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { RHFInput } from "@/components/form";

import CardWrapper from "@/components/shared/CardWrapper";
import CircularLoading from "@/components/shared/CircularLoading";
import CustomHeader from "@/components/page-heading/CustomHeader";

import {
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "@/redux/features/customer/customerApi";

import { cleanPayload } from "@/utils/clean-payload";

const UserSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),

  shopName: Yup.string().trim().required("Shop name is required"),

  address: Yup.string().trim(),

  email: Yup.string().trim().email("Invalid email address"),

  phone: Yup.string()
    .trim()
    .notRequired()
    .matches(
      /^$|^01[0-9]{9}$/,
      "Phone number must be a valid 11-digit Bangladeshi number"
    ),
});

export default function CustomerForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  // eslint-disable-next-line no-unused-vars
  const [createCustomer, { isLoading, isError, error }] =
    useCreateCustomerMutation();

  const [updateCustomer, { isLoading: _updateLoading }] =
    useUpdateCustomerMutation();

  const { data: currentCustomer, isLoading: currentCustomerLoading } =
    useGetCustomerByIdQuery(id, { skip: !id });

  const defaultValues = {
    name: "",
    shopName: "",
    address: "",
    email: "",
    phone: "",
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCustomer?.data && isEdit) {
      reset({
        name: currentCustomer?.data?.name || "",
        shopName: currentCustomer?.data?.shopName || "",
        address: currentCustomer?.data?.address || "",
        email: currentCustomer?.data?.email || "",
        phone: currentCustomer?.data?.phone || "",
      });
    }
  }, [currentCustomer?.data, isEdit, reset]);

  const onSubmit = async (data) => {
    const cleanData = cleanPayload(data);

    const action = isEdit ? updateCustomer : createCustomer;

    const payload = isEdit ? { data: cleanData, customerId: id } : cleanData;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await action(payload).unwrap();

      if (result.success) {
        toast.success(
          result.message ||
            (isEdit
              ? "Customer updated successfully"
              : "Customer added successfully")
        );

        if (!isEdit) reset();

        navigate("/customers");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <CustomHeader
        title="Customers"
        subtitle={isEdit ? "Edit existing customer" : "Create new customer"}
      />

      {currentCustomerLoading ? (
        <CircularLoading />
      ) : (
        <CardWrapper>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-5">
              <RHFInput
                name="name"
                label="Customers full name *"
                type="text"
                placeholder="Enter customers full name"
              />

              <RHFInput
                name="shopName"
                label="Shop name *"
                type="text"
                placeholder="Enter shop name"
              />

              <RHFInput
                name="address"
                label="Address (optional)"
                type="text"
                placeholder="Enter full address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInput
                  name="phone"
                  label="Phone (optional)"
                  type="tel"
                  placeholder="Enter customers phone"
                />

                <RHFInput
                  name="email"
                  label="Email (optional)"
                  placeholder="Enter customers email address"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEdit
                    ? "Update"
                    : "Create Customer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardWrapper>
      )}
    </>
  );
}
