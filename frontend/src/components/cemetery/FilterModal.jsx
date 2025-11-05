import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Reusable filter modal component for Cemetery sections
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Handler to close the modal
 * @param {Object} tempFilters - Temporary filter state
 * @param {Function} setTempFilters - Function to update temp filters
 * @param {Object} expandedSections - Which filter sections are expanded
 * @param {Function} onToggleSection - Function to toggle section expansion
 * @param {Function} onApply - Handler to apply filters
 * @param {Function} onCancel - Handler to cancel filters
 * @param {Array} statusOptions - Array of status options for the section
 */
const FilterModal = ({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  expandedSections,
  onToggleSection,
  onApply,
  onCancel,
  statusOptions = [],
}) => {
  if (!isOpen) return null;

  const handleStatusToggle = (status) => {
    setTempFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
      <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Table filters
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Here you can customise your table view to find needed data.
          </p>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {/* Contract ID Filter */}
            <div className="border rounded-lg">
              <button
                onClick={() => onToggleSection("contractId")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Contract ID</span>
                  {tempFilters.contractId && (
                    <span className="text-sm text-gray-500">1</span>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedSections.contractId ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.contractId && (
                <div className="px-4 pb-4">
                  <Input
                    type="text"
                    placeholder="Search by contract ID..."
                    value={tempFilters.contractId}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        contractId: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="border rounded-lg">
              <button
                onClick={() => onToggleSection("status")}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Status</span>
                  {tempFilters.status.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {tempFilters.status.length}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedSections.status ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.status && (
                <div className="px-4 pb-4 space-y-2">
                  {statusOptions.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded accent-black"
                        checked={tempFilters.status.includes(status)}
                        onChange={() => handleStatusToggle(status)}
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={onApply}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
