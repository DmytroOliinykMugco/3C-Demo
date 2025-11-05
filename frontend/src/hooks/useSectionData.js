import { useState, useMemo } from "react";

/**
 * Custom hook to manage filters, pagination, and selection for a data section
 * @param {Array} data - The data array to manage
 * @param {number} initialRowsPerPage - Initial rows per page (default: 5)
 * @returns {Object} - State and handlers for the section
 */
export const useSectionData = (data = [], initialRowsPerPage = 5) => {
  // Filter states
  const [filters, setFilters] = useState({
    contractId: "",
    status: [],
  });
  const [tempFilters, setTempFilters] = useState({
    contractId: "",
    status: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    contractId: true,
    status: false,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // View mode state
  const [viewMode, setViewMode] = useState("table");

  // Show all state (for load all functionality)
  const [showAll, setShowAll] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesContractId =
        !filters.contractId ||
        item.contractId.toLowerCase().includes(filters.contractId.toLowerCase());
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(item.status);

      return matchesContractId && matchesStatus;
    });
  }, [data, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Display data (either paginated or all)
  const displayedData = showAll ? filteredData : paginatedData;

  // Selection handlers
  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData?.map((item) => item.id) || []));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Filter handlers
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCancelFilters = () => {
    setTempFilters(filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      contractId: "",
      status: [],
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleLoadAll = () => {
    setShowAll(true);
  };

  // Check if filters are active
  const hasActiveFilters = filters.contractId || filters.status.length > 0;

  return {
    // Filter state
    filters,
    tempFilters,
    setTempFilters,
    showFilters,
    setShowFilters,
    expandedFilters,
    hasActiveFilters,

    // Pagination state
    currentPage,
    rowsPerPage,
    totalPages,
    selectedRows,

    // View mode
    viewMode,
    setViewMode,

    // Data
    filteredData,
    paginatedData,
    displayedData,
    showAll,

    // Handlers
    handleSelectRow,
    handleSelectAll,
    handleApplyFilters,
    handleCancelFilters,
    handleResetFilters,
    toggleFilterSection,
    handlePageChange,
    handleRowsPerPageChange,
    handleLoadAll,
  };
};
