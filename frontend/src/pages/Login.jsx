import { useLocation } from "react-router-dom";

import { ModeToggle } from "@/components/theme/ModeToggle";

import LoginForm from "@/components/auth/LoginForm";
import ChangePassForm from "@/components/auth/ChangePassForm";

export default function Login() {
  const { pathname } = useLocation();

  const changePassword = pathname.includes("change-password");

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Theme toggle */}
      <div className="fixed bottom-8 right-8 z-50">
        <ModeToggle />
      </div>

      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
        <img
          src="/login.webp"
          alt="Dashboard Preview"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="absolute top-4 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <img src="/icon.png" className="w-24" />
            <h1 className="text-2xl font-bold text-[#B38A2D]">Alishan</h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="text-2xl font-bold mb-2 text-[#B38A2D]">
            Welcome to Alishan
          </h2>
          <p className="text-sm text-gray-200">
            Your complete inventory management solution with real-time analytics
            and insights
          </p>
        </div>
      </div>

      {/* Right side - Login/ Change password form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-4">
        {changePassword ? <ChangePassForm /> : <LoginForm />}
      </div>
    </div>
  );
}
