import { Filter, LayoutList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FilterSearchBar = ({
  onFilterClick,
  onViewClick,
  onSearchChange,
  searchValue = "",
  showFilters = true,
  showView = true,
  showSearch = true,
  filterLabel = "Filters",
  viewLabel = "View",
  searchPlaceholder = "Search",
  className = "",
}) => {
  return (
    <div className={`flex gap-3 mb-6 ${className}`}>
      {showFilters && (
        <Button variant="outline" size="sm" onClick={onFilterClick}>
          <Filter className="w-4 h-4 mr-2" />
          {filterLabel}
        </Button>
      )}
      {showView && (
        <Button variant="outline" size="sm" onClick={onViewClick}>
          <LayoutList className="w-4 h-4 mr-2" />
          {viewLabel}
        </Button>
      )}
      {showSearch && (
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
    </div>
  );
};

export default FilterSearchBar;
