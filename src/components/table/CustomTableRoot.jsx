import { Table } from "../ui/table";

export function CustomTableRoot({ children, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby }) {
  return (
    <div className="rounded-md border overflow-x-auto" role="region" tabIndex={0} aria-label={ariaLabel} aria-labelledby={ariaLabelledby}>
      <Table className="border-separate border-spacing-y-2 px-3">
        {children}
      </Table>
    </div>
  );
}
