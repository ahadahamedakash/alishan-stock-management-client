import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function CustomTableHeader({ columns }) {
  return (
    <TableHeader>
      <TableRow>
        {[...columns, { key: "actions", label: "" }].map((col) => (
          <TableHead
            key={col.key}
            scope="col"
            className={cn(
              "text-base",
              col.align === "center" && "text-center",
              col.align === "right" && "text-right",
              col.align === "left" && "text-left"
            )}
            aria-sort={col.sortable ? "none" : undefined}
          >
            {col.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
