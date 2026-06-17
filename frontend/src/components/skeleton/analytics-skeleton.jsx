import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsSkeleton = () => {
  const skeletonColorClass = "bg-gray-200 dark:bg-gray-400/20";

  return (
    <>
      {/* Header Skeleton (mimics CustomHeader) */}
      <div className="mb-6">
        <Skeleton className={`h-8 w-64 mb-2 ${skeletonColorClass}`} />
        <Skeleton className={`h-5 w-96 ${skeletonColorClass}`} />
      </div>

      {/* Stat Cards Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className={`h-4 w-24 ${skeletonColorClass}`} />
              </CardTitle>
              <Skeleton
                className={`h-5 w-5 rounded-full ${skeletonColorClass}`}
              />{" "}
              {/* Icon skeleton */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className={`h-8 w-32 ${skeletonColorClass}`} />
              </div>
              {/* Optional: Trend skeleton if you want to show it */}
              {/* <p className="text-xs text-muted-foreground mt-1">
                <Skeleton className={`h-3 w-20 ${skeletonColorClass}`} />
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Summary Chart Skeleton */}
      <div className="grid grid-cols-1 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className={`h-6 w-48 ${skeletonColorClass}`} />
            </CardTitle>
            <CardDescription>
              <Skeleton className={`h-4 w-64 ${skeletonColorClass}`} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for the chart area */}
            <Skeleton className={`h-64 w-full ${skeletonColorClass}`} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Expense Card + Monthly Sell Summary Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expense Card Skeleton */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className={`h-6 w-48 ${skeletonColorClass}`} />
            </CardTitle>
            <CardDescription>
              <Skeleton className={`h-4 w-64 ${skeletonColorClass}`} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* List of recent expenses */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <Skeleton
                    className={`h-8 w-8 rounded-full ${skeletonColorClass}`}
                  />{" "}
                  {/* Icon/Avatar */}
                  <div>
                    <Skeleton
                      className={`h-4 w-32 mb-1 ${skeletonColorClass}`}
                    />{" "}
                    {/* Item name */}
                    <Skeleton
                      className={`h-3 w-24 ${skeletonColorClass}`}
                    />{" "}
                    {/* Category/Description */}
                  </div>
                </div>
                <Skeleton className={`h-4 w-20 ${skeletonColorClass}`} />{" "}
                {/* Amount */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Sell Summary Skeleton */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className={`h-6 w-48 ${skeletonColorClass}`} />
            </CardTitle>
            <CardDescription>
              <Skeleton className={`h-4 w-64 ${skeletonColorClass}`} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for the bar chart area */}
            <Skeleton className={`h-64 w-full ${skeletonColorClass}`} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnalyticsSkeleton;
