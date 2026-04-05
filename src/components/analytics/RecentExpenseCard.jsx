import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentExpenseCard({
  activities,
  className,
  primaryColor,
  title = "Recent Expense",
}) {
  return (
    <Card
      className={cn(
        "border-neutral-200/20 dark:border-neutral-800/30",
        "bg-white/10 dark:bg-black/10 backdrop-blur-lg",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6 px-2">
            {activities?.data?.slice(0, 10).map((activity, index) => (
              <div key={index + 1} className="relative pl-6">
                {/* Timeline connector */}
                <div className="absolute top-0 left-0 w-px h-full bg-neutral-200 dark:bg-neutral-800" />

                {/* Timeline dot */}
                <div
                  className="absolute top-1 left-0 w-2 h-2 rounded-full -translate-x-[3px]"
                  style={{ backgroundColor: primaryColor }}
                />

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      {activity?.category.charAt(0).toUpperCase() +
                        activity.category.slice(1)}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {/* {new Date(activity?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )} */}
                      {formatDistance(
                        new Date(activity.createdAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {activity?.description}
                  </span>

                  <p className="text-sm text-red-600 mb-2">
                    {`${activity.amount} Tk`}
                  </p>

                  {activity.issuedBy && (
                    <span className="bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400 py-2 px-3 rounded-full text-xs">
                      {activity?.issuedBy.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
