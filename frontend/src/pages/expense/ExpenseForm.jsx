import * as Yup from "yup";
import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  RHFInput,
  RHFSelect,
  RHFTextArea,
  RHFDatePicker,
} from "@/components/form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import CardWrapper from "@/components/shared/CardWrapper";
import CustomHeader from "@/components/page-heading/CustomHeader";

import { useGetAllEmployeeQuery } from "@/redux/features/employee/employeeApi";
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from "@/redux/features/expense/expenseApi";

import { EXPENSE_OPTIONS } from "@/constants";
import { cleanPayload } from "@/utils/clean-payload";

const ExpenseSchema = Yup.object().shape({
  date: Yup.string().trim().required("Date is required"),

  description: Yup.string().trim().required("Description is required"),

  category: Yup.string()
    .trim()
    .required("Please select a category")
    .notOneOf([""], "Please select a category"),

  amount: Yup.number()
    .typeError("Price must be a number")
    .required("Expense amount is required")
    .positive("Expense amount must be a positive number"),

  employeeId: Yup.string(),
});

export default function ExpenseForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const isEdit = Boolean(id);

  const selectedCategory = searchParams.get("category") ?? "";

  // EMPLOYEES
  const { data: employeeData, isSuccess } = useGetAllEmployeeQuery();

  const [createExpense] = useCreateExpenseMutation();

  const [updateExpense] = useUpdateExpenseMutation();

  const employeeOptions = useMemo(() => {
    if (!isSuccess || !Array.isArray(employeeData?.data)) return [];
    return employeeData.data.map((customer) => ({
      value: customer._id,
      label: customer.name,
    }));
  }, [employeeData, isSuccess]);

  const defaultValues = {
    date: new Date().toISOString().split("T")[0],
    category: selectedCategory,
    description: "",
    amount: "",
    employeeId: "",
  };

  const methods = useForm({
    resolver: yupResolver(ExpenseSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchCategory = watch("category");

  const watchEmployeeId = watch("employeeId");

  const selectedEmployee = useMemo(() => {
    if (!watchEmployeeId || !isSuccess) return null;
    return (
      employeeData?.data?.find((emp) => emp._id === watchEmployeeId) || null
    );
  }, [watchEmployeeId, employeeData, isSuccess]);

  useEffect(() => {
    if (watchCategory === "salary" && selectedEmployee?.monthlySalary) {
      methods.setValue("amount", selectedEmployee.monthlySalary);
    }
  }, [watchCategory, selectedEmployee, methods]);

  const onSubmit = async (data) => {
    const cleanData = cleanPayload(data);

    const action = isEdit ? updateExpense : createExpense;

    const payload = isEdit ? { data: cleanData, productId: id } : cleanData;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await action(payload).unwrap();

      if (result.success) {
        toast.success(
          result.message ||
            (isEdit
              ? "Expense updated successfully"
              : "Expense added successfully")
        );

        if (!isEdit) reset();

        navigate("/expenses");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <CustomHeader title="Expense" subtitle="Add your expenses" />

      <CardWrapper>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <RHFDatePicker
              name="date"
              label="Pick a date (DD-MM-YYYY) *"
              lockToToday={true}
            />

            <RHFSelect
              name="category"
              label="Category *"
              placeholder="Select expense category"
              options={EXPENSE_OPTIONS}
              disabled
            />

            {watchCategory === "salary" && (
              <RHFSelect
                name="employeeId"
                label="Select Employee *"
                placeholder="Choose employee"
                options={employeeOptions}
              />
            )}

            <RHFTextArea
              name="description"
              label="Description *"
              placeholder="Enter description"
            />

            <RHFInput
              name="amount"
              label="Amount *"
              type="number"
              placeholder="Enter expense amount"
              disabled={watchCategory === "salary"}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/expenses")}
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
                  : "Add Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}
