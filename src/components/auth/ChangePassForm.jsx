import * as yup from "yup";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { useThemeContext } from "../theme/ThemeProvider";

import { Form } from "../ui/form";
import { RHFInput } from "../form";
import { Button } from "../ui/button";

import { useChangePasswordMutation } from "@/redux/features/auth/authAPI";

const passwordChangeSchema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

export default function ChangePassForm() {
  const navigate = useNavigate();

  const { primaryColor } = useThemeContext();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const defaultValues = {
    oldPassword: "",
    newPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(passwordChangeSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const isFormFilled = watch("email") && watch("password");

  const onSubmit = async (data) => {
    const loadingToastId = toast.loading("Submitting...");

    try {
      const response = await changePassword(data).unwrap();

      if (response.success) {
        toast.success(response.message || "Password changed successfully!", {
          id: loadingToastId,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (
          response?.data?.role === "accountant" ||
          response?.data?.role === "stock_manager"
        ) {
          navigate("/products", { replace: true });
          return;
        }
        navigate("/", { replace: true });

        reset();
      }
    } catch (err) {
      toast.error(err?.data?.error || "Login failed. Please try again.", {
        id: loadingToastId,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      toast.dismiss(loadingToastId);
    }
  };
  return (
    <div className="w-full max-w-md relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neutral-900/20 dark:to-neutral-100/20 rounded-lg" />

      <div className="relative bg-card text-card-foreground rounded-lg border shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold" style={{ color: primaryColor }}>
            Change Your Password
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your current password and choose a new password
          </p>
        </div>

        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <RHFInput
              name="oldPassword"
              label="Old password"
              type="password"
              placeholder="Enter your old password"
              icon={Lock}
            />
            <RHFInput
              name="newPassword"
              label="New password"
              type="password"
              placeholder="Enter your new password"
              icon={Lock}
            />

            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full custom-button"
            >
              {isLoading || isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          By changing your password, you agree to our Terms of Service and
          Privacy Policy
        </p>
      </div>
    </div>
  );
}
