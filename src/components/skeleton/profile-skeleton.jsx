import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative w-full">
        {/* Cover Image Skeleton */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-xl bg-gray-200 dark:bg-gray-700">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Profile Picture Skeleton */}
        <div className="absolute -bottom-12 left-4 sm:left-6 md:left-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="absolute -bottom-12 -md:bottom-14 right-4 sm:right-6 md:right-8">
          <div className="relative flex items-center space-x-1 px-2 py-1">
            <Skeleton className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="pt-28 w-full mx-auto">
        <div className="flex w-full flex-col gap-6">
          {/* User Profile Card Skeleton */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-5 w-64 bg-gray-200 dark:bg-gray-700" />
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                {/* Full Name */}
                <div>
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Email */}
                <div>
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Phone */}
                <div>
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Role */}
                <div>
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Gender */}
                <div>
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <Skeleton className="h-4 w-24 mb-1 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
