import { lazy, Suspense, useEffect } from "react";
import { Banknote, BanknoteX, BanknoteArrowDown, Loader2 } from "lucide-react";

import { useBoolean } from "@/hooks";
import { useThemeContext } from "@/components/theme/ThemeProvider";

import { StatCard } from "../components/analytics/StatCard";

import {
  useGetSalesSummaryQuery,
  useGetRecentExpensesQuery,
  useGetMonthlySalesSummaryQuery,
} from "@/redux/features/analytics/analyticsApi";
import { useGetBalanceQuery } from "@/redux/features/balance/balanceApi";

import CustomHeader from "@/components/page-heading/CustomHeader";
import AnalyticsSkeleton from "@/components/skeleton/analytics-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// LAZY IMPORTS
const SalesSummaryChart = lazy(() =>
  import("@/components/analytics/SalesSummaryChart")
);
const RecentExpenseCard = lazy(() =>
  import("@/components/analytics/RecentExpenseCard")
);
const MonthlySellSummary = lazy(() =>
  import("@/components/analytics/MonthlySellSummary")
);

export default function Analytics() {
  const { primaryColor } = useThemeContext();

  const mount = useBoolean();

  const skeletonColorClass = "bg-gray-200 dark:bg-gray-400/20";

  // SALES SUMMARY
  const { data: salesSummary, isLoading: salesLoadingState } =
    useGetSalesSummaryQuery();
  // SALES SUMMARY
  const { data: monthlySalesSummary, isLoading: monthlySalesLoadingState } =
    useGetMonthlySalesSummaryQuery();

  // BALANCE DATA
  const { data: balanceData, isLoading: balanceLoadingState } =
    useGetBalanceQuery();

  // EXPENSE DATA
  const { data: expenseHistory, isLoading: expenseLoadingState } =
    useGetRecentExpensesQuery();

  const loadingState =
    balanceLoadingState &&
    expenseLoadingState &&
    monthlySalesLoadingState &&
    salesLoadingState;

  const mockSalesData = [];

  for (let i = 1; i <= 15; i++) {
    mockSalesData.push({
      name: String("June " + i),
      value: Math.floor(Math.random() * (1500 - 500 + 1)) + 500,
    });
  }

  useEffect(() => {
    mount.onTrue();
  }, [mount]);

  if (!mount.value) return null;

  return (
    <>
      {/* Dashboard Header */}
      <CustomHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store today."
      />

      {loadingState ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Revenue"
              value={
                balanceData?.data
                  ? `${balanceData?.data[0]?.totalPaid} Tk`
                  : "0 Tk"
              }
              icon={<Banknote className="h-5 w-5" style={{ color: "green" }} />}
              // trend={{ value: 12, positive: true }}
            />

            <StatCard
              title="Total expense"
              value={
                balanceData?.data
                  ? `${balanceData?.data[0]?.totalExpense} Tk`
                  : "0 Tk"
              }
              icon={
                <BanknoteArrowDown
                  className="h-5 w-5"
                  style={{ color: "red" }}
                />
              }
              // trend={{ value: 8, positive: true }}
            />

            <StatCard
              title="Current balance"
              value={
                balanceData?.data
                  ? `${balanceData?.data[0]?.currentBalance} Tk`
                  : "0 Tk"
              }
              icon={<Banknote className="h-5 w-5" style={{ color: "green" }} />}
            />

            {/* <StatCard
              title={
                customerData?.data && customerData?.data?.length > 1
                  ? "Total customers"
                  : "Total customer"
              }
              value={customerData?.data ? customerData?.data.length : 0}
              icon={
                <Users className="h-5 w-5" style={{ color: primaryColor }} />
              }
              // trend={{ value: 15, positive: true }}
            /> */}

            <StatCard
              title="Total Due"
              value={
                balanceData?.data
                  ? `${balanceData?.data[0]?.totalUnPaid} Tk`
                  : "0 Tk"
              }
              icon={
                <BanknoteX
                  className="h-5 w-5"
                  style={{ color: "yellowgreen" }}
                />
              }
              // trend={{ value: 3, positive: true }}
            />
          </div>

          {/* Charts Row */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"> */}
          <div className="grid grid-cols-1 mb-6">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 mb-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-400/20" />
                      </CardTitle>
                      <CardDescription>
                        <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-400/20" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder for the chart area */}
                      <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-400/20" />
                    </CardContent>
                  </Card>
                </div>
              }
            >
              <SalesSummaryChart
                title="Daily sales"
                description="Last 15 days sell"
                data={salesSummary ? salesSummary?.data : []}
                type="line"
                className="lg:col-span-2"
              />
            </Suspense>

            {/* <ChartCard
              title="Product Categories"
              description="Distribution by product type"
              data={mockProductData}
              type="pie"
            /> */}
          </div>

          {/* Activity + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Suspense
              fallback={
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
                        <Skeleton
                          className={`h-4 w-20 ${skeletonColorClass}`}
                        />{" "}
                        {/* Amount */}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              }
            >
              <RecentExpenseCard
                activities={expenseHistory}
                primaryColor={primaryColor}
                className="lg:col-span-2"
              />
            </Suspense>

            <Suspense
              fallback={
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
              }
            >
              <MonthlySellSummary
                title="Monthly Sell"
                description="Last 4 monts sell summary"
                data={monthlySalesSummary ? monthlySalesSummary?.data : []}
                type="bar"
              />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
