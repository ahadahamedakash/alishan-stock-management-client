import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ columns, numRows = 5, hasActions = false }) => {
  if (!columns || columns.length === 0) {
    return null;
  }

  const rows = Array.from({ length: numRows });
  const baseColumnClasses = "flex-1";

  // Helper function to determine skeleton properties based on column
  const getSkeletonProps = (col) => {
    let skeletonWidth = "w-full";
    let skeletonHeight = "h-6";
    let skeletonShape = "";
    let alignClass = "";

    const lowerCaseKey = col.key?.toLowerCase();
    const lowerCaseLabel = col.label?.toLowerCase();

    if (
      lowerCaseKey === "image" ||
      lowerCaseKey === "avatar" ||
      lowerCaseLabel?.includes("image") ||
      lowerCaseLabel?.includes("photo")
    ) {
      skeletonWidth = "w-12";
      skeletonHeight = "h-12";
      skeletonShape = "rounded-md";
      alignClass = "justify-center";
    } else if (
      lowerCaseKey === "type" ||
      lowerCaseKey === "status" ||
      lowerCaseLabel?.includes("status") ||
      lowerCaseLabel?.includes("type")
    ) {
      skeletonWidth = "w-24";
      skeletonHeight = "h-6";
      skeletonShape = "rounded-full";
      alignClass = "justify-center";
    } else if (
      lowerCaseKey === "quantity" ||
      lowerCaseKey === "stock" ||
      lowerCaseKey === "count" ||
      lowerCaseLabel?.includes("quantity") ||
      lowerCaseLabel?.includes("stock")
    ) {
      skeletonWidth = "w-1/2";
      alignClass = "justify-center";
    } else if (
      lowerCaseKey?.includes("description") ||
      lowerCaseKey?.includes("issuedby") ||
      lowerCaseKey?.includes("email") ||
      lowerCaseKey?.includes("phone") ||
      lowerCaseKey?.includes("role") ||
      lowerCaseKey?.includes("name")
    ) {
      skeletonWidth = "w-full";
    } else if (
      lowerCaseKey?.includes("amount") ||
      lowerCaseKey?.includes("price") ||
      lowerCaseKey?.includes("cost") ||
      lowerCaseKey?.includes("due") ||
      lowerCaseKey?.includes("paid") ||
      lowerCaseLabel?.includes("price")
    ) {
      skeletonWidth = "w-2/3";
      alignClass = "justify-end";
    } else if (
      lowerCaseKey?.includes("date") ||
      lowerCaseKey?.includes("at") ||
      lowerCaseLabel?.includes("date")
    ) {
      skeletonWidth = "w-3/4";
    } else if (
      lowerCaseKey?.includes("id") ||
      lowerCaseKey?.includes("number") ||
      lowerCaseKey?.includes("sku")
    ) {
      skeletonWidth = "w-2/3";
    }

    return { skeletonWidth, skeletonHeight, skeletonShape, alignClass };
  };

  return (
    <div className="w-full">
      {/* Filter/Search Skeletons - Keep as is */}
      <div className="mb-6 px-1 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <Skeleton className="h-10 w-full max-w-xs bg-gray-200 dark:bg-gray-400/20" />
        </div>
        <div className="col-span-12 md:col-span-4">
          <Skeleton className="h-10 w-full max-w-[200px] bg-gray-200 dark:bg-gray-400/20" />
        </div>
        <div className="col-span-12 md:col-span-2">
          <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-400/20" />
        </div>
      </div>

      <div className="border rounded-md">
        {/* Skeleton for Table Header */}
        <div className="flex p-4 border-b">
          {columns.map((col, colIndex) => {
            const { skeletonWidth, skeletonHeight, skeletonShape, alignClass } =
              getSkeletonProps(col);
            return (
              <div
                key={col.key || colIndex}
                className={`${baseColumnClasses} flex items-center ${alignClass} px-2`}
              >
                <Skeleton
                  className={`${skeletonHeight} ${skeletonWidth} ${skeletonShape} bg-gray-200 dark:bg-gray-400/20`}
                />
              </div>
            );
          })}

          {hasActions && (
            <div
              className={`${baseColumnClasses} flex items-center justify-end px-2`}
            >
              {/* Header for actions column - typically empty or a small icon */}
              <Skeleton className="h-6 w-1/4 bg-gray-200 dark:bg-gray-400/20" />
            </div>
          )}
        </div>

        {/* Skeleton for Table Body Rows */}
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="flex p-4 border-b last:border-b-0">
            {columns.map((col, colIndex) => {
              const {
                skeletonWidth,
                skeletonHeight,
                skeletonShape,
                alignClass,
              } = getSkeletonProps(col);
              return (
                <div
                  key={col.key || colIndex}
                  className={`${baseColumnClasses} flex items-center ${alignClass} px-2`}
                >
                  <Skeleton
                    className={`${skeletonHeight} ${skeletonWidth} ${skeletonShape} bg-gray-200 dark:bg-gray-400/20`}
                  />
                </div>
              );
            })}
            {/* Render action column skeletons if hasActions is true */}
            {hasActions && (
              <div
                className={`${baseColumnClasses} flex items-center justify-end px-2`}
              >
                {/* Skeletons for action buttons/icons */}
                <Skeleton className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-400/20" />
                <Skeleton className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-400/20" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Skeletons */}
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-400/20" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-400/20" />
          <Skeleton className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-400/20" />
          <Skeleton className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-400/20" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
