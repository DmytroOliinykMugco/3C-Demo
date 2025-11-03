import { LayoutGrid, LayoutList } from "lucide-react";

const ViewModeToggle = ({ viewMode, onViewModeChange, label = "View" }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        onClick={() => onViewModeChange("cards")}
        className={`p-2 rounded ${
          viewMode === "cards" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-label="Card view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={`p-2 rounded ${
          viewMode === "table" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-label="Table view"
      >
        <LayoutList className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ViewModeToggle;
