import * as yup from "yup";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { useBoolean } from "@/hooks";
import { verifyToken } from "@/utils/verifty-token";
import { useThemeContext } from "../theme/ThemeProvider";

import { setUser } from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/authAPI";

import { Form } from "../ui/form";
import { RHFInput } from "../form";
import { Button } from "../ui/button";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const activateLogin = useBoolean();

  const { primaryColor } = useThemeContext();

  const [login, { isLoading }] = useLoginMutation();

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(loginSchema),
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
    const loadingToastId = toast.loading("Wait a moment!");

    try {
      const response = await login(data).unwrap();

      if (response.success) {
        const user = await verifyToken(response?.data?.accessToken);

        dispatch(setUser({ user, token: response?.data?.accessToken }));

        toast.success(
          response?.data?.needsPassowrdChange
            ? "Login successful. Please change your password to continue!"
            : response.message || "Logged in successfully!",
          {
            id: loadingToastId,
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (response?.data?.needsPassowrdChange) {
          navigate("/change-password", { replace: true });
        } else if (
          response?.data?.userRole === "accountant" ||
          response?.data?.userRole === "stock_manager"
        ) {
          navigate("/products", { replace: true });
          return;
        } else {
          navigate("/", { replace: true });
        }

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

  const handleLogin = async (loginAs) => {
    activateLogin.onTrue();

    const credentialMap = {
      admin: "admin@alishan.com",
      accountant: "accountant@alishan.com",
      stockManager: "stockmanager@alishan.com",
    };

    const email = credentialMap[loginAs];

    const credentials = {
      email,
      password: "Alishan124578",
    };

    const loadingToastId = toast.loading("Wait a moment!");

    try {
      const response = await login(credentials).unwrap();

      if (response.success) {
        const user = await verifyToken(response?.data?.accessToken);

        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch(setUser({ user, token: response?.data?.accessToken }));

        toast.success(
          response?.data?.needsPassowrdChange
            ? "Login successful. Please change your password to continue!"
            : response.message || "Logged in successfully!",
          {
            id: loadingToastId,
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (response?.data?.needsPassowrdChange) {
          navigate("/change-password", { replace: true });
        } else if (
          response?.data?.userRole === "accountant" ||
          response?.data?.userRole === "stock_manager"
        ) {
          navigate("/products", { replace: true });
          return;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));

          navigate("/", { replace: true });
        }

        reset();
      }
    } catch (err) {
      toast.error(err?.data?.error || "Login failed. Please try again.", {
        id: loadingToastId,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      toast.dismiss(loadingToastId);
      activateLogin.onFalse();
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neutral-900/20 dark:to-neutral-100/20 rounded-lg" />

      <div className="relative bg-card text-card-foreground rounded-lg border shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold" style={{ color: primaryColor }}>
            Sign in to your account
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <RHFInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
            />

            <RHFInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
            />

            <Button
              type="submit"
              disabled={isLoading || isSubmitting || activateLogin.value}
              className="w-full custom-button"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Button
            className="w-full custom-button-outline"
            onClick={() => handleLogin("admin")}
            disabled={activateLogin.value}
          >
            Sign in as Admin
          </Button>
          <Button
            className="w-full custom-button-outline"
            onClick={() => handleLogin("accountant")}
            disabled={activateLogin.value}
          >
            Sign in as Accountant
          </Button>
          <div className="col-span-1 md:col-span-2">
            <Button
              className="w-full custom-button-outline"
              onClick={() => handleLogin("stockManager")}
              disabled={activateLogin.value}
            >
              Sign in as Stock Manager
            </Button>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
