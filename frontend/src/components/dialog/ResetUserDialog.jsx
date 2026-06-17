import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useThemeContext } from "../theme/ThemeProvider";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";

import { RHFInput } from "../form";

import { useResetUserMutation } from "@/redux/features/user/userApi";

const ResetUserSchema = Yup.object().shape({
  password: Yup.string().trim().required("Initial password is required"),
});

export default function ResetUserDialog({ openDialog, userData }) {
  const { primaryColor } = useThemeContext();

  const [resetUser, { isLoading }] = useResetUserMutation();

  const defaultValues = {
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(ResetUserSchema),
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

      const payload = {
        ...data,
        userId: userData.id,
      };

      const result = await resetUser(payload).unwrap();

      if (result.success) {
        toast.success(result.message || "User resetted successfully");

        openDialog.onFalse();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog open={openDialog.value} onOpenChange={openDialog.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ color: primaryColor }}>
            Reset user
          </DialogTitle>
          {userData && (
            <DialogHeader className="text-red-500 text-sm">{`Reset ${userData?.name}'s password`}</DialogHeader>
          )}
          <DialogClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => {
              openDialog.onFalse();
              reset();
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <RHFInput
              name="password"
              label="New password *"
              placeholder="Enter new password"
            />

            <Button
              type="submit"
              variant="success"
              className="w-full mt-3"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Submitting..." : "Confirm reset"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
