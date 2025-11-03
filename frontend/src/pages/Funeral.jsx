import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
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
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";

const Funeral = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table' - for dedicated tabs

  // View mode states for All tab sections
  const [servicesViewMode, setServicesViewMode] = useState("cards");
  const [merchandiseViewMode, setMerchandiseViewMode] = useState("cards");

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

  const {
    data: funeralResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["funeral"],
    queryFn: api.getFuneral,
  });

  const funeralData = funeralResponse?.data;

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  // Helper functions for status colors
  const getServiceStatusColor = (status) => {
    switch (status) {
      case "In Trust":
        return "bg-blue-100 text-blue-900";
      case "Not Purchased":
        return "bg-red-100 text-red-900";
      case "Used":
        return "bg-yellow-100 text-yellow-900";
      case "Paid":
        return "bg-green-100 text-green-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getMerchandiseStatusColor = (status) => {
    switch (status) {
      case "In Trust":
        return "bg-blue-100 text-blue-900";
      case "Not Purchased":
        return "bg-red-100 text-red-900";
      case "Used":
        return "bg-yellow-100 text-yellow-900";
      case "Paid":
        return "bg-green-100 text-green-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  // Services pagination helpers
  const servicesTotalPages = Math.ceil(
    (funeralData?.funeralServices.length || 0) / servicesRowsPerPage
  );
  const servicesStartIndex = (servicesCurrentPage - 1) * servicesRowsPerPage;
  const servicesEndIndex = servicesStartIndex + servicesRowsPerPage;
  const paginatedServices = funeralData?.funeralServices.slice(
    servicesStartIndex,
    servicesEndIndex
  );

  const displayedServices = showAllServices
    ? funeralData?.funeralServices
    : funeralData?.funeralServices.slice(0, 5);

  const handleServicesFirstPage = () => setServicesCurrentPage(1);
  const handleServicesPrevPage = () =>
    setServicesCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleServicesNextPage = () =>
    setServicesCurrentPage((prev) => Math.min(prev + 1, servicesTotalPages));
  const handleServicesLastPage = () => setServicesCurrentPage(servicesTotalPages);

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
      const allIds = new Set(paginatedServices.map((s) => s.id));
      setServicesSelectedRows(allIds);
    } else {
      setServicesSelectedRows(new Set());
    }
  };

  const handleServicesRowsPerPageChange = (value) => {
    setServicesRowsPerPage(Number(value));
    setServicesCurrentPage(1);
  };

  // Merchandise pagination helpers
  const merchandiseTotalPages = Math.ceil(
    (funeralData?.merchandise.length || 0) / merchandiseRowsPerPage
  );
  const merchandiseStartIndex =
    (merchandiseCurrentPage - 1) * merchandiseRowsPerPage;
  const merchandiseEndIndex = merchandiseStartIndex + merchandiseRowsPerPage;
  const paginatedMerchandise = funeralData?.merchandise.slice(
    merchandiseStartIndex,
    merchandiseEndIndex
  );

  const displayedMerchandise = showAllMerchandise
    ? funeralData?.merchandise
    : funeralData?.merchandise.slice(0, 5);

  const handleMerchandiseFirstPage = () => setMerchandiseCurrentPage(1);
  const handleMerchandisePrevPage = () =>
    setMerchandiseCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleMerchandiseNextPage = () =>
    setMerchandiseCurrentPage((prev) =>
      Math.min(prev + 1, merchandiseTotalPages)
    );
  const handleMerchandiseLastPage = () =>
    setMerchandiseCurrentPage(merchandiseTotalPages);

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
      const allIds = new Set(paginatedMerchandise.map((m) => m.id));
      setMerchandiseSelectedRows(allIds);
    } else {
      setMerchandiseSelectedRows(new Set());
    }
  };

  const handleMerchandiseRowsPerPageChange = (value) => {
    setMerchandiseRowsPerPage(Number(value));
    setMerchandiseCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading funeral services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Error loading funeral services: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Funeral</h1>
        <p className="text-gray-600">
          Here you can manage all your funeral service's details
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="funeralServices">Funeral services</TabsTrigger>
          <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "all" && (
        <div>
          {/* Funeral Services Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Funeral services
                </h2>
                <p className="text-gray-600">
                  Review all funeral services associated with your account.
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
                onClick={() => handleComingSoon("Filters")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
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
                                checked={servicesSelectedRows.has(service.id)}
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
                      {funeralData?.funeralServices.length || 0} row(s)
                      selected.
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
                          disabled={servicesCurrentPage === servicesTotalPages}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleServicesLastPage}
                          disabled={servicesCurrentPage === servicesTotalPages}
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

                {!showAllServices &&
                  funeralData?.funeralServices.length > 5 && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllServices(true)}
                      >
                        Load all ({funeralData?.funeralServices.length})
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Merchandise Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Merchandise
                </h2>
                <p className="text-gray-600">
                  Review all merchandise associated with your cemetery services.
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
                onClick={() => handleComingSoon("Filters")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
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
                                checked={merchandiseSelectedRows.has(item.id)}
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
                      {funeralData?.merchandise.length || 0} row(s) selected.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                          value={merchandiseRowsPerPage}
                          onChange={(e) =>
                            handleMerchandiseRowsPerPageChange(e.target.value)
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
                        Page {merchandiseCurrentPage} of {merchandiseTotalPages}
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

                {!showAllMerchandise && funeralData?.merchandise.length > 5 && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllMerchandise(true)}
                    >
                      Load all ({funeralData?.merchandise.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "funeralServices" && (
        <div>
          {/* Funeral Services Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Funeral services
                </h2>
                <p className="text-gray-600">
                  Review all funeral services associated with your account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View</span>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded ${
                    viewMode === "cards" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded ${
                    viewMode === "table" ? "bg-gray-200" : "hover:bg-gray-100"
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
                onClick={() => handleComingSoon("Filters")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
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
                                checked={servicesSelectedRows.has(service.id)}
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
                      {funeralData?.funeralServices.length || 0} row(s)
                      selected.
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
                          disabled={servicesCurrentPage === servicesTotalPages}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleServicesLastPage}
                          disabled={servicesCurrentPage === servicesTotalPages}
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

                {!showAllServices &&
                  funeralData?.funeralServices.length > 5 && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllServices(true)}
                      >
                        Load all ({funeralData?.funeralServices.length})
                      </Button>
                    </div>
                  )}
              </div>
            )}
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
                  Review all merchandise associated with your funeral services.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View</span>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded ${
                    viewMode === "cards" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded ${
                    viewMode === "table" ? "bg-gray-200" : "hover:bg-gray-100"
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
                onClick={() => handleComingSoon("Filters")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
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
                                checked={merchandiseSelectedRows.has(item.id)}
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
                      {funeralData?.merchandise.length || 0} row(s) selected.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                          value={merchandiseRowsPerPage}
                          onChange={(e) =>
                            handleMerchandiseRowsPerPageChange(e.target.value)
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
                        Page {merchandiseCurrentPage} of {merchandiseTotalPages}
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

                {!showAllMerchandise && funeralData?.merchandise.length > 5 && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllMerchandise(true)}
                    >
                      Load all ({funeralData?.merchandise.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Funeral;
