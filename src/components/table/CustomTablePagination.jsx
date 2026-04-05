import { Button } from "@/components/ui/button";

export function CustomTablePagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-end items-center gap-4 px-4 py-3 border-t">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
