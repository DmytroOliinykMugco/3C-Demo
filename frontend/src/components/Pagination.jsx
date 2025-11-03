import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  selectedRowsCount,
  totalDataCount,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50, 100],
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between mt-4 text-sm text-gray-600 ${className}`}>
      <p>
        {selectedRowsCount} of {totalDataCount} row(s) selected.
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onFirstPage}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="First page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onLastPage}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Last page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
