import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Filter,
  LayoutGrid,
  LayoutList,
  MapPin,
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import DocumentViewer from "@/components/DocumentViewer";

const Cemetery = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'cards' or 'table' - for dedicated tabs

  // View mode states for All tab sections
  const [propertyViewMode, setPropertyViewMode] = useState("table");
  const [servicesViewMode, setServicesViewMode] = useState("table");
  const [merchandiseViewMode, setMerchandiseViewMode] = useState("table");
  const [designationTab, setDesignationTab] = useState("signed");

  // Property pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Services pagination state
  const [servicesCurrentPage, setServicesCurrentPage] = useState(1);
  const [servicesRowsPerPage, setServicesRowsPerPage] = useState(5);
  const [servicesSelectedRows, setServicesSelectedRows] = useState(new Set());
  const [showAllServices, setShowAllServices] = useState(false);

  // Merchandise pagination state
  const [merchandiseCurrentPage, setMerchandiseCurrentPage] = useState(1);
  const [merchandiseRowsPerPage, setMerchandiseRowsPerPage] = useState(5);
  const [merchandiseSelectedRows, setMerchandiseSelectedRows] = useState(
    new Set()
  );
  const [showAllMerchandise, setShowAllMerchandise] = useState(false);

  // Document viewer state
  const [viewerDocument, setViewerDocument] = useState(null);

  // Filter states - Property
  const [propertyFilters, setPropertyFilters] = useState({
    contractId: "",
    status: [],
  });
  const [tempPropertyFilters, setTempPropertyFilters] = useState({
    contractId: "",
    status: [],
  });
  const [showPropertyFilters, setShowPropertyFilters] = useState(false);
  const [expandedPropertyFilters, setExpandedPropertyFilters] = useState({
    contractId: true,
    status: false,
  });

  // Filter states - Services
  const [servicesFilters, setServicesFilters] = useState({
    contractId: "",
    status: [],
  });
  const [tempServicesFilters, setTempServicesFilters] = useState({
    contractId: "",
    status: [],
  });
  const [showServicesFilters, setShowServicesFilters] = useState(false);
  const [expandedServicesFilters, setExpandedServicesFilters] = useState({
    contractId: true,
    status: false,
  });

  // Filter states - Merchandise
  const [merchandiseFilters, setMerchandiseFilters] = useState({
    contractId: "",
    status: [],
  });
  const [tempMerchandiseFilters, setTempMerchandiseFilters] = useState({
    contractId: "",
    status: [],
  });
  const [showMerchandiseFilters, setShowMerchandiseFilters] = useState(false);
  const [expandedMerchandiseFilters, setExpandedMerchandiseFilters] = useState({
    contractId: true,
    status: false,
  });

  const {
    data: cemeteryResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cemetery"],
    queryFn: api.getCemetery,
  });

  const cemeteryData = cemeteryResponse?.data;

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  // Document handlers
  const handlePreviewDocument = (doc) => {
    setViewerDocument({
      url: `http://localhost:3000/example-pdfs/${doc.fileName}`,
      name: doc.name,
      fileName: doc.fileName
    });
  };

  const handleDownloadDocument = (doc) => {
    const url = `http://localhost:3000/example-pdfs/${doc.fileName}`;
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        console.error('Download failed:', error);
        addToast('Failed to download document', 'error');
      });
  };

  const closeDocumentViewer = () => {
    setViewerDocument(null);
  };

  // Filter helper functions - Property
  const togglePropertyFilterSection = (section) => {
    setExpandedPropertyFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePropertyFilterToggle = (key, value) => {
    setTempPropertyFilters(prev => {
      const currentArray = prev[key];
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  const applyPropertyFilters = () => {
    setPropertyFilters(tempPropertyFilters);
    setShowPropertyFilters(false);
    setCurrentPage(1);
  };

  const cancelPropertyFilters = () => {
    setTempPropertyFilters(propertyFilters);
    setShowPropertyFilters(false);
  };

  // Filter helper functions - Services
  const toggleServicesFilterSection = (section) => {
    setExpandedServicesFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleServicesFilterToggle = (key, value) => {
    setTempServicesFilters(prev => {
      const currentArray = prev[key];
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  const applyServicesFilters = () => {
    setServicesFilters(tempServicesFilters);
    setShowServicesFilters(false);
    setServicesCurrentPage(1);
  };

  const cancelServicesFilters = () => {
    setTempServicesFilters(servicesFilters);
    setShowServicesFilters(false);
  };

  // Filter helper functions - Merchandise
  const toggleMerchandiseFilterSection = (section) => {
    setExpandedMerchandiseFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMerchandiseFilterToggle = (key, value) => {
    setTempMerchandiseFilters(prev => {
      const currentArray = prev[key];
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  const applyMerchandiseFilters = () => {
    setMerchandiseFilters(tempMerchandiseFilters);
    setShowMerchandiseFilters(false);
    setMerchandiseCurrentPage(1);
  };

  const cancelMerchandiseFilters = () => {
    setTempMerchandiseFilters(merchandiseFilters);
    setShowMerchandiseFilters(false);
  };

  // Apply filters to properties
  const filteredProperties = cemeteryData?.properties.filter((property) => {
    const matchesContractId = !propertyFilters.contractId ||
      property.contractId.toLowerCase().includes(propertyFilters.contractId.toLowerCase());
    const matchesStatus = propertyFilters.status.length === 0 ||
      propertyFilters.status.includes(property.status);

    return matchesContractId && matchesStatus;
  }) || [];

  // Pagination helpers
  const totalPages = Math.ceil(filteredProperties.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

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
      setSelectedRows(new Set(paginatedProperties?.map((p) => p.id) || []));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Apply filters to services
  const filteredServices = cemeteryData?.services.filter((service) => {
    const matchesContractId = !servicesFilters.contractId ||
      service.contractId.toLowerCase().includes(servicesFilters.contractId.toLowerCase());
    const matchesStatus = servicesFilters.status.length === 0 ||
      servicesFilters.status.includes(service.status);

    return matchesContractId && matchesStatus;
  }) || [];

  // Services pagination helpers
  const servicesTotalPages = Math.ceil(filteredServices.length / servicesRowsPerPage);
  const servicesStartIndex = (servicesCurrentPage - 1) * servicesRowsPerPage;
  const servicesEndIndex = servicesStartIndex + servicesRowsPerPage;
  const paginatedServices = filteredServices.slice(servicesStartIndex, servicesEndIndex);

  const handleServicesFirstPage = () => setServicesCurrentPage(1);
  const handleServicesPrevPage = () =>
    setServicesCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleServicesNextPage = () =>
    setServicesCurrentPage((prev) => Math.min(prev + 1, servicesTotalPages));
  const handleServicesLastPage = () =>
    setServicesCurrentPage(servicesTotalPages);

  const handleServicesRowsPerPageChange = (value) => {
    setServicesRowsPerPage(Number(value));
    setServicesCurrentPage(1);
  };

  const handleSelectServiceRow = (id) => {
    const newSelected = new Set(servicesSelectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setServicesSelectedRows(newSelected);
  };

  const handleSelectAllServices = (checked) => {
    if (checked) {
      setServicesSelectedRows(
        new Set(paginatedServices?.map((s) => s.id) || [])
      );
    } else {
      setServicesSelectedRows(new Set());
    }
  };

  const displayedServices = showAllServices
    ? filteredServices
    : filteredServices.slice(0, 5);

  const getServiceStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Trust":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Apply filters to merchandise
  const filteredMerchandise = cemeteryData?.merchandise.filter((item) => {
    const matchesContractId = !merchandiseFilters.contractId ||
      item.contractId.toLowerCase().includes(merchandiseFilters.contractId.toLowerCase());
    const matchesStatus = merchandiseFilters.status.length === 0 ||
      merchandiseFilters.status.includes(item.status);

    return matchesContractId && matchesStatus;
  }) || [];

  // Merchandise pagination helpers
  const merchandiseTotalPages = Math.ceil(filteredMerchandise.length / merchandiseRowsPerPage);
  const merchandiseStartIndex = (merchandiseCurrentPage - 1) * merchandiseRowsPerPage;
  const merchandiseEndIndex = merchandiseStartIndex + merchandiseRowsPerPage;
  const paginatedMerchandise = filteredMerchandise.slice(merchandiseStartIndex, merchandiseEndIndex);

  const handleMerchandiseFirstPage = () => setMerchandiseCurrentPage(1);
  const handleMerchandisePrevPage = () =>
    setMerchandiseCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleMerchandiseNextPage = () =>
    setMerchandiseCurrentPage((prev) =>
      Math.min(prev + 1, merchandiseTotalPages)
    );
  const handleMerchandiseLastPage = () =>
    setMerchandiseCurrentPage(merchandiseTotalPages);

  const handleMerchandiseRowsPerPageChange = (value) => {
    setMerchandiseRowsPerPage(Number(value));
    setMerchandiseCurrentPage(1);
  };

  const handleSelectMerchandiseRow = (id) => {
    const newSelected = new Set(merchandiseSelectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setMerchandiseSelectedRows(newSelected);
  };

  const handleSelectAllMerchandise = (checked) => {
    if (checked) {
      setMerchandiseSelectedRows(
        new Set(paginatedMerchandise?.map((m) => m.id) || [])
      );
    } else {
      setMerchandiseSelectedRows(new Set());
    }
  };

  const displayedMerchandise = showAllMerchandise
    ? filteredMerchandise
    : filteredMerchandise.slice(0, 5);

  const getMerchandiseStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Not Purchased":
        return "bg-red-100 text-red-800";
      case "Used":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading cemetery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Error loading cemetery: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "In Trust":
        return "bg-blue-100 text-blue-800";
      case "Not Purchased":
        return "bg-red-100 text-red-800";
      case "Used":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cemetery</h1>
        <p className="text-gray-600">
          Here you can manage all your cemetery service's details
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="property">Property</TabsTrigger>
              <TabsTrigger value="services">Cemetery services</TabsTrigger>
              <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "all" && (
            <div>
              {/* Property Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Property
                    </h2>
                    <p className="text-gray-600">
                      Manage the plots, memorials, and records of rest.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setPropertyViewMode("cards")}
                      className={`p-2 rounded ${
                        propertyViewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPropertyViewMode("table")}
                      className={`p-2 rounded ${
                        propertyViewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPropertyFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(propertyFilters.contractId || propertyFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {propertyViewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedProperties?.length > 0 &&
                                    paginatedProperties.every((p) =>
                                      selectedRows.has(p.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedProperties?.map((property) => (
                              <tr
                                key={property.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={selectedRows.has(property.id)}
                                    onChange={() =>
                                      handleSelectRow(property.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {property.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {property.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {property.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getStatusColor(
                                      property.status
                                    )}`}
                                  >
                                    {property.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Property actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {selectedRows.size} of{" "}
                          {filteredProperties.length || 0} row(s)
                          selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={rowsPerPage}
                              onChange={(e) =>
                                handleRowsPerPageChange(e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleFirstPage}
                              disabled={currentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleLastPage}
                              disabled={currentPage === totalPages}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {propertyViewMode === "cards" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredProperties.map((property) => (
                      <Card key={property.id}>
                        <CardContent className="p-0">
                          {/* Contract ID Badge */}
                          <div className="relative">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                Contract ID: {property.contractId}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {property.name}
                              </h3>
                              <button
                                onClick={() =>
                                  handleComingSoon("Property actions")
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                            <span
                              className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getStatusColor(
                                property.status
                              )}`}
                            >
                              {property.status}
                            </span>

                            {/* Beneficiary */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-700">
                                  {property.beneficiary.initials}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {property.beneficiary.name}
                                </p>
                                <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                  {property.beneficiary.badge}
                                </span>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>Location</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificates of Sepulcher Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Certificates of Sepulcher
                </h2>
                <p className="text-gray-600 mb-4">
                  When you fully pay off any property, the certificate of
                  sepulcher will show here.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cemeteryData?.certificates.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {cert.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {cert.size}
                              </p>
                              {cert.propertyId && (
                                <p className="text-xs text-gray-500">
                                  Property ID: {cert.propertyId}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewDocument(cert)}
                            >
                              Preview
                            </Button>
                            <button
                              onClick={() => handleDownloadDocument(cert)}
                              className="p-2 hover:bg-gray-100 rounded"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Designation of Interment Rights Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Designation of Interment Rights
                </h2>
                <p className="text-gray-600 mb-4">
                  You have the ability to transfer ownership of burial rights
                  that belong to you.
                </p>

                <Card className="mb-4">
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                              Location
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                              Assignee
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cemeteryData?.designationRights.map((right) => (
                            <tr
                              key={right.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 text-sm text-gray-900">
                                {right.location}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 text-sm rounded font-medium ${
                                    right.status === "Available"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {right.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-700">
                                      {right.assignee.initials}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-900">
                                    {right.assignee.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {right.status === "Available" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleComingSoon("Designate rights")
                                    }
                                  >
                                    Designate
                                  </Button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Rights actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-sm text-gray-600 mb-4">
                  You can designate rights from the table or by directly
                  changing the document. Download a template and add all the
                  changes by yourself.
                </p>
                <ol className="text-sm text-gray-600 mb-6 ml-5 list-decimal">
                  <li>
                    Download the "[TEMPLATE] Designation of Interment Rights" in
                    Examples
                  </li>
                  <li>Sign via DocuSign</li>
                  <li>Upload signed document</li>
                </ol>

                <Tabs value={designationTab} onValueChange={setDesignationTab}>
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="signed">Signed documents</TabsTrigger>
                    <TabsTrigger value="example">Example</TabsTrigger>
                  </TabsList>

                  {designationTab === "signed" && (
                    <div className="w-1/2">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Signed document
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-5 h-5 text-gray-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  [TEMPLATE] Designation of In...
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                                    Signed
                                  </span>
                                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                                    On review
                                  </span>
                                  <p className="text-sm text-gray-500">2.4mb</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleComingSoon("Preview template")
                                }
                              >
                                Preview
                              </Button>
                              <button
                                onClick={() =>
                                  handleComingSoon("Download template")
                                }
                                className="p-2 hover:bg-gray-100 rounded"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {designationTab === "example" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-5 h-5 text-gray-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  [TEMPLATE] Designation of In...
                                </p>
                                <p className="text-sm text-gray-500">2.4mb</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleComingSoon("Preview template")
                                }
                              >
                                Preview
                              </Button>
                              <button
                                onClick={() =>
                                  handleComingSoon("Download template")
                                }
                                className="p-2 hover:bg-gray-100 rounded"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Signed document
                          </h3>
                          <div className="flex gap-3">
                            <Input type="file" className="flex-1" />
                            <Button
                              onClick={() => handleComingSoon("Send to counselor")}
                              className="bg-black text-white hover:bg-gray-800 whitespace-nowrap"
                            >
                              Send to counselor
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Tabs>
              </div>

              {/* Cemetery Services Section - same as dedicated tab */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Cemetery services
                    </h2>
                    <p className="text-gray-600">
                      Review all cemetery services associated with your account.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setServicesViewMode("cards")}
                      className={`p-2 rounded ${
                        servicesViewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setServicesViewMode("table")}
                      className={`p-2 rounded ${
                        servicesViewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowServicesFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(servicesFilters.contractId || servicesFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {servicesViewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedServices?.length > 0 &&
                                    paginatedServices.every((s) =>
                                      servicesSelectedRows.has(s.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAllServices(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedServices?.map((service) => (
                              <tr
                                key={service.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={servicesSelectedRows.has(
                                      service.id
                                    )}
                                    onChange={() =>
                                      handleSelectServiceRow(service.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {service.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {service.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {service.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getServiceStatusColor(
                                      service.status
                                    )}`}
                                  >
                                    {service.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Service actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {servicesSelectedRows.size} of{" "}
                          {filteredServices.length || 0} row(s) selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={servicesRowsPerPage}
                              onChange={(e) =>
                                handleServicesRowsPerPageChange(e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {servicesCurrentPage} of {servicesTotalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleServicesFirstPage}
                              disabled={servicesCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesPrevPage}
                              disabled={servicesCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesNextPage}
                              disabled={
                                servicesCurrentPage === servicesTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesLastPage}
                              disabled={
                                servicesCurrentPage === servicesTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {servicesViewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {displayedServices?.map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {service.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {service.name}
                                </h3>
                                <button
                                  onClick={() =>
                                    handleComingSoon("Service actions")
                                  }
                                  className="p-1 hover:bg-gray-100 rounded ml-2"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getServiceStatusColor(
                                  service.status
                                )}`}
                              >
                                {service.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {service.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {service.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {service.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{service.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!showAllServices && filteredServices.length > 5 && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllServices(true)}
                        >
                          Load all ({filteredServices.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Merchandise Section - same as dedicated tab */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Merchandise
                    </h2>
                    <p className="text-gray-600">
                      Review all merchandise associated with your cemetery
                      services.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setMerchandiseViewMode("cards")}
                      className={`p-2 rounded ${
                        merchandiseViewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setMerchandiseViewMode("table")}
                      className={`p-2 rounded ${
                        merchandiseViewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMerchandiseFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(merchandiseFilters.contractId || merchandiseFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {merchandiseViewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedMerchandise?.length > 0 &&
                                    paginatedMerchandise.every((m) =>
                                      merchandiseSelectedRows.has(m.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAllMerchandise(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedMerchandise?.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandiseSelectedRows.has(
                                      item.id
                                    )}
                                    onChange={() =>
                                      handleSelectMerchandiseRow(item.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {item.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {item.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {item.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getMerchandiseStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Merchandise actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {merchandiseSelectedRows.size} of{" "}
                          {filteredMerchandise.length || 0} row(s)
                          selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={merchandiseRowsPerPage}
                              onChange={(e) =>
                                handleMerchandiseRowsPerPageChange(
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {merchandiseCurrentPage} of{" "}
                            {merchandiseTotalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleMerchandiseFirstPage}
                              disabled={merchandiseCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandisePrevPage}
                              disabled={merchandiseCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandiseNextPage}
                              disabled={
                                merchandiseCurrentPage === merchandiseTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandiseLastPage}
                              disabled={
                                merchandiseCurrentPage === merchandiseTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {merchandiseViewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {displayedMerchandise?.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {item.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() =>
                                    handleComingSoon("Merchandise actions")
                                  }
                                  className="p-1 hover:bg-gray-100 rounded ml-2"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getMerchandiseStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {item.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {item.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              {item.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{item.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!showAllMerchandise &&
                      filteredMerchandise.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => setShowAllMerchandise(true)}
                          >
                            Load all ({filteredMerchandise.length})
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "property" && (
            <div>
              {/* Property Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Property
                    </h2>
                    <p className="text-gray-600">
                      Manage the plots, memorials, and records of rest.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`p-2 rounded ${
                        viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded ${
                        viewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPropertyFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(propertyFilters.contractId || propertyFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {viewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedProperties?.length > 0 &&
                                    paginatedProperties.every((p) =>
                                      selectedRows.has(p.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedProperties?.map((property) => (
                              <tr
                                key={property.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={selectedRows.has(property.id)}
                                    onChange={() =>
                                      handleSelectRow(property.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {property.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {property.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {property.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getStatusColor(
                                      property.status
                                    )}`}
                                  >
                                    {property.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {property.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Property actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {selectedRows.size} of{" "}
                          {filteredProperties.length || 0} row(s)
                          selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={rowsPerPage}
                              onChange={(e) =>
                                handleRowsPerPageChange(e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleFirstPage}
                              disabled={currentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleLastPage}
                              disabled={currentPage === totalPages}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cemeteryData?.properties.map((property) => (
                      <Card key={property.id}>
                        <CardContent className="p-0">
                          {/* Contract ID Badge */}
                          <div className="relative">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                Contract ID: {property.contractId}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {property.name}
                              </h3>
                              <button
                                onClick={() =>
                                  handleComingSoon("Property actions")
                                }
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                            <span
                              className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getStatusColor(
                                property.status
                              )}`}
                            >
                              {property.status}
                            </span>

                            {/* Beneficiary */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-700">
                                  {property.beneficiary.initials}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {property.beneficiary.name}
                                </p>
                                <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                  {property.beneficiary.badge}
                                </span>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>Location</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Documents
                </h2>
                <p className="text-gray-600 mb-4">
                  When you fully pay off any property, the certificate of
                  sepulcher will show here. You can edit Designation of
                  Interment rights and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    contact counselor
                  </a>
                  .
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cemeteryData?.documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {doc.size}
                              </p>
                              {doc.propertyId && (
                                <p className="text-xs text-gray-500">
                                  Property ID: {doc.propertyId}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewDocument(doc)}
                            >
                              Preview
                            </Button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-2 hover:bg-gray-100 rounded"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              {/* Cemetery Services Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Cemetery services
                    </h2>
                    <p className="text-gray-600">
                      Review all cemetery services associated with your account.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`p-2 rounded ${
                        viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded ${
                        viewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowServicesFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(servicesFilters.contractId || servicesFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComingSoon("View options")}
                  >
                    <LayoutList className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type="text" placeholder="Search" className="pl-10" />
                  </div>
                </div>

                {/* Table View */}
                {viewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedServices?.length > 0 &&
                                    paginatedServices.every((s) =>
                                      servicesSelectedRows.has(s.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAllServices(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedServices?.map((service) => (
                              <tr
                                key={service.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={servicesSelectedRows.has(
                                      service.id
                                    )}
                                    onChange={() =>
                                      handleSelectServiceRow(service.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {service.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {service.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {service.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getServiceStatusColor(
                                      service.status
                                    )}`}
                                  >
                                    {service.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {service.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Service actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {servicesSelectedRows.size} of{" "}
                          {filteredServices.length || 0} row(s) selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={servicesRowsPerPage}
                              onChange={(e) =>
                                handleServicesRowsPerPageChange(e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {servicesCurrentPage} of {servicesTotalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleServicesFirstPage}
                              disabled={servicesCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesPrevPage}
                              disabled={servicesCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesNextPage}
                              disabled={
                                servicesCurrentPage === servicesTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleServicesLastPage}
                              disabled={
                                servicesCurrentPage === servicesTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {displayedServices?.map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-0">
                            {/* Service Image */}
                            <div className="relative">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {service.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              {/* Title and Status */}
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {service.name}
                                </h3>
                                <button
                                  onClick={() =>
                                    handleComingSoon("Service actions")
                                  }
                                  className="p-1 hover:bg-gray-100 rounded ml-2"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getServiceStatusColor(
                                  service.status
                                )}`}
                              >
                                {service.status}
                              </span>

                              {/* Beneficiary */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {service.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {service.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {service.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{service.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Load All Button */}
                    {!showAllServices && filteredServices.length > 5 && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllServices(true)}
                        >
                          Load all ({filteredServices.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Services Needed Section */}
              <div className="mt-8">
                <Card className="bg-slate-700 text-white border-none">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-2">
                          Services needed
                        </h2>
                        <p className="text-slate-200">
                          Ensure your loved ones' legacies are secured. Some
                          services may be missing from your current contracts.
                          Contact you counselor to get more details.
                        </p>
                      </div>
                      <Button
                        onClick={() => handleComingSoon("Contact counselor")}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        Contact counselor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "merchandise" && (
            <div>
              {/* Merchandise Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Merchandise
                    </h2>
                    <p className="text-gray-600">
                      Review all merchandise associated with your cemetery
                      services.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`p-2 rounded ${
                        viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded ${
                        viewMode === "table"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMerchandiseFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(merchandiseFilters.contractId || merchandiseFilters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComingSoon("View options")}
                  >
                    <LayoutList className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type="text" placeholder="Search" className="pl-10" />
                  </div>
                </div>

                {/* Table View */}
                {viewMode === "table" && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={
                                    paginatedMerchandise?.length > 0 &&
                                    paginatedMerchandise.every((m) =>
                                      merchandiseSelectedRows.has(m.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAllMerchandise(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract ID
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Name
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Service ID
                              </th>
                              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedMerchandise?.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandiseSelectedRows.has(
                                      item.id
                                    )}
                                    onChange={() =>
                                      handleSelectMerchandiseRow(item.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {item.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {item.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {item.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getMerchandiseStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {item.serviceId}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      handleComingSoon("Merchandise actions")
                                    }
                                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <p>
                          {merchandiseSelectedRows.size} of{" "}
                          {filteredMerchandise.length || 0} row(s)
                          selected.
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select
                              value={merchandiseRowsPerPage}
                              onChange={(e) =>
                                handleMerchandiseRowsPerPageChange(
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                          </div>
                          <span>
                            Page {merchandiseCurrentPage} of{" "}
                            {merchandiseTotalPages}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleMerchandiseFirstPage}
                              disabled={merchandiseCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandisePrevPage}
                              disabled={merchandiseCurrentPage === 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandiseNextPage}
                              disabled={
                                merchandiseCurrentPage === merchandiseTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleMerchandiseLastPage}
                              disabled={
                                merchandiseCurrentPage === merchandiseTotalPages
                              }
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronsRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {displayedMerchandise?.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-0">
                            {/* Merchandise Image */}
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {item.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              {/* Title and Status */}
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() =>
                                    handleComingSoon("Merchandise actions")
                                  }
                                  className="p-1 hover:bg-gray-100 rounded ml-2"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded font-medium mb-3 ${getMerchandiseStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>

                              {/* Beneficiary */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {item.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {item.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              {/* Location */}
                              {item.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{item.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Load All Button */}
                    {!showAllMerchandise &&
                      filteredMerchandise.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => setShowAllMerchandise(true)}
                          >
                            Load all ({filteredMerchandise.length})
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Merchandise Needed Section */}
              <div className="mt-8">
                <Card className="bg-slate-700 text-white border-none">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-2">
                          Merchandise needed
                        </h2>
                        <p className="text-slate-200">
                          Ensure your loved ones' legacies are secured. Some
                          Merchandise may be missing from your current
                          contracts. Contact you counselor to get more details.
                        </p>
                      </div>
                      <Button
                        onClick={() => handleComingSoon("Contact counselor")}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        Contact counselor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer */}
      {viewerDocument && (
        <DocumentViewer
          documentUrl={viewerDocument.url}
          documentName={viewerDocument.name}
          onClose={closeDocumentViewer}
          onDownload={() => handleDownloadDocument({
            name: viewerDocument.name,
            fileName: viewerDocument.fileName
          })}
        />
      )}

      {/* Property Filters Modal */}
      {showPropertyFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
          <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Table filters
                </h3>
                <button
                  onClick={() => setShowPropertyFilters(false)}
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
                    onClick={() => togglePropertyFilterSection("contractId")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contract ID</span>
                      {tempPropertyFilters.contractId && (
                        <span className="text-sm text-gray-500">1</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedPropertyFilters.contractId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedPropertyFilters.contractId && (
                    <div className="px-4 pb-4">
                      <Input
                        type="text"
                        placeholder="Search by contract ID..."
                        value={tempPropertyFilters.contractId}
                        onChange={(e) =>
                          setTempPropertyFilters((prev) => ({
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
                    onClick={() => togglePropertyFilterSection("status")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Status</span>
                      {tempPropertyFilters.status.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {tempPropertyFilters.status.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedPropertyFilters.status ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedPropertyFilters.status && (
                    <div className="px-4 pb-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempPropertyFilters.status.includes("In Trust")}
                          onChange={() =>
                            handlePropertyFilterToggle("status", "In Trust")
                          }
                        />
                        <span className="text-sm text-gray-700">In Trust</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempPropertyFilters.status.includes("Not Purchased")}
                          onChange={() =>
                            handlePropertyFilterToggle("status", "Not Purchased")
                          }
                        />
                        <span className="text-sm text-gray-700">Not Purchased</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempPropertyFilters.status.includes("Used")}
                          onChange={() =>
                            handlePropertyFilterToggle("status", "Used")
                          }
                        />
                        <span className="text-sm text-gray-700">Used</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempPropertyFilters.status.includes("Paid")}
                          onChange={() =>
                            handlePropertyFilterToggle("status", "Paid")
                          }
                        />
                        <span className="text-sm text-gray-700">Paid</span>
                      </label>
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
                  onClick={cancelPropertyFilters}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={applyPropertyFilters}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Filters Modal */}
      {showServicesFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
          <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Table filters
                </h3>
                <button
                  onClick={() => setShowServicesFilters(false)}
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
                    onClick={() => toggleServicesFilterSection("contractId")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contract ID</span>
                      {tempServicesFilters.contractId && (
                        <span className="text-sm text-gray-500">1</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedServicesFilters.contractId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedServicesFilters.contractId && (
                    <div className="px-4 pb-4">
                      <Input
                        type="text"
                        placeholder="Search by contract ID..."
                        value={tempServicesFilters.contractId}
                        onChange={(e) =>
                          setTempServicesFilters((prev) => ({
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
                    onClick={() => toggleServicesFilterSection("status")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Status</span>
                      {tempServicesFilters.status.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {tempServicesFilters.status.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedServicesFilters.status ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedServicesFilters.status && (
                    <div className="px-4 pb-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempServicesFilters.status.includes("Paid")}
                          onChange={() =>
                            handleServicesFilterToggle("status", "Paid")
                          }
                        />
                        <span className="text-sm text-gray-700">Paid</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempServicesFilters.status.includes("In Trust")}
                          onChange={() =>
                            handleServicesFilterToggle("status", "In Trust")
                          }
                        />
                        <span className="text-sm text-gray-700">In Trust</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempServicesFilters.status.includes("Not Purchased")}
                          onChange={() =>
                            handleServicesFilterToggle("status", "Not Purchased")
                          }
                        />
                        <span className="text-sm text-gray-700">Not Purchased</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempServicesFilters.status.includes("Used")}
                          onChange={() =>
                            handleServicesFilterToggle("status", "Used")
                          }
                        />
                        <span className="text-sm text-gray-700">Used</span>
                      </label>
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
                  onClick={cancelServicesFilters}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={applyServicesFilters}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchandise Filters Modal */}
      {showMerchandiseFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
          <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Table filters
                </h3>
                <button
                  onClick={() => setShowMerchandiseFilters(false)}
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
                    onClick={() => toggleMerchandiseFilterSection("contractId")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contract ID</span>
                      {tempMerchandiseFilters.contractId && (
                        <span className="text-sm text-gray-500">1</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedMerchandiseFilters.contractId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMerchandiseFilters.contractId && (
                    <div className="px-4 pb-4">
                      <Input
                        type="text"
                        placeholder="Search by contract ID..."
                        value={tempMerchandiseFilters.contractId}
                        onChange={(e) =>
                          setTempMerchandiseFilters((prev) => ({
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
                    onClick={() => toggleMerchandiseFilterSection("status")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Status</span>
                      {tempMerchandiseFilters.status.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {tempMerchandiseFilters.status.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedMerchandiseFilters.status ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMerchandiseFilters.status && (
                    <div className="px-4 pb-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempMerchandiseFilters.status.includes("Paid")}
                          onChange={() =>
                            handleMerchandiseFilterToggle("status", "Paid")
                          }
                        />
                        <span className="text-sm text-gray-700">Paid</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempMerchandiseFilters.status.includes("In Trust")}
                          onChange={() =>
                            handleMerchandiseFilterToggle("status", "In Trust")
                          }
                        />
                        <span className="text-sm text-gray-700">In Trust</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempMerchandiseFilters.status.includes("Not Purchased")}
                          onChange={() =>
                            handleMerchandiseFilterToggle("status", "Not Purchased")
                          }
                        />
                        <span className="text-sm text-gray-700">Not Purchased</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempMerchandiseFilters.status.includes("Used")}
                          onChange={() =>
                            handleMerchandiseFilterToggle("status", "Used")
                          }
                        />
                        <span className="text-sm text-gray-700">Used</span>
                      </label>
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
                  onClick={cancelMerchandiseFilters}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={applyMerchandiseFilters}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cemetery;
