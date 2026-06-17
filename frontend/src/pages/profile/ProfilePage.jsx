import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { SelectSeparator } from "@/components/ui/select";

import { useThemeContext } from "@/components/theme/ThemeProvider";

import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";

import CircularLoading from "@/components/shared/CircularLoading";
import ProfileSkeleton from "@/components/skeleton/profile-skeleton";
import UserForm from "../user/UserForm";

// ------ HELPER FUUNCTION ------
const formatRole = (role) => {
  if (!role) return "N/A";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("details");

  const { primaryColor } = useThemeContext();

  const userDetails = useSelector(useCurrentUser);

  const userId = userDetails?.user?.userId;

  // CURRENT USER DATA
  const { data: currentUser, isLoading } = useGetUserByIdQuery(userId, {
    skip: !userId,
    forceRefetch: true,
  });

  const avatarSrc =
    currentUser?.data?.gender === "male"
      ? "/male-avatar.png"
      : "female-avatar.webp";

  const tabs = [
    { id: "details", label: "Details" },
    { id: "edit", label: "Edit Details" },
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-xl">
          <img
            src="/galaxy-dust.jpeg"
            alt="profile-cover"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-black/30 to-black/10 pointer-events-none" />
        </div>

        <div className="absolute -bottom-12 left-4 sm:left-6 md:left-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img
              src={currentUser?.data?.image || avatarSrc}
              className="w-full h-full object-cover"
              alt="profile-picture"
            />
          </div>
        </div>

        <div className="absolute -bottom-12 -md:bottom-14 right-4 sm:right-6 md:right-8">
          <div className="relative flex items-center space-x-1 px-2 py-1 text-primary">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-md font-medium transition-colors duration-200`}
                  style={
                    activeTab === tab.id
                      ? { color: primaryColor, fontWeight: "bold" }
                      : {}
                  }
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5  rounded-full transition-all duration-300 ease-in-out"
                      style={{ color: primaryColor }}
                    />
                  )}
                </button>
                {/* Separator */}
                {index < tabs.length - 1 && (
                  <SelectSeparator className="w-px h-4 bg-gray-300 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-28 w-full mx-auto">
        <div className="flex w-full flex-col gap-6">
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "details"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 absolute pointer-events-none"
            }`}
          >
            {activeTab === "details" && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle
                    className="text-xl sm:text-2xl"
                    style={{ color: primaryColor }}
                  >
                    User Profile
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Here's your basic profile information.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {currentUser?.data?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {currentUser?.data?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {currentUser?.data?.phone || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">
                        {formatRole(currentUser?.data?.role)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">
                        {currentUser?.data?.gender || "N/A"}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {currentUser?.data?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Password Tab Content */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "edit"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 absolute pointer-events-none"
            }`}
          >
            {activeTab === "edit" &&
              (isLoading ? (
                <CircularLoading />
              ) : (
                <UserForm mode="profile" userData={currentUser} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
