import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  LayoutGrid,
  LayoutList,
  MapPin,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useSectionData } from "@/hooks/useSectionData";
import FilterModal from "@/components/cemetery/FilterModal";
import Pagination from "@/components/cemetery/Pagination";

const Funeral = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table' - for dedicated tabs

  const {
    data: funeralResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["funeral"],
    queryFn: api.getFuneral,
  });

  const funeralData = funeralResponse?.data;

  // Use custom hook for Services section
  const services = useSectionData(funeralData?.funeralServices || [], 5);

  // Use custom hook for Merchandise section
  const merchandise = useSectionData(funeralData?.merchandise || [], 5);

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  // Helper functions for status colors
  const getStatusColor = (status) => {
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

  const getServiceStatusColor = getStatusColor;
  const getMerchandiseStatusColor = getStatusColor;

  // Status options for filters
  const servicesStatusOptions = ["Paid", "Pending", "In Trust"];
  const merchandiseStatusOptions = ["Paid", "Not Purchased", "Used"];

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

      <Card>
        <CardContent className="p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="funeralServices">
                Funeral services
              </TabsTrigger>
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
                      onClick={() => services.setViewMode("cards")}
                      className={`p-2 rounded ${
                        services.viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => services.setViewMode("table")}
                      className={`p-2 rounded ${
                        services.viewMode === "table"
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
                    onClick={() => services.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(services.filters.contractId || services.filters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {services.viewMode === "table" && (
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
                                    services.paginatedData?.length > 0 &&
                                    services.paginatedData.every((s) =>
                                      services.selectedRows.has(s.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    services.handleSelectAll(e.target.checked)
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
                            {services.paginatedData?.map((serviceItem) => (
                              <tr
                                key={serviceItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={services.selectedRows.has(
                                      serviceItem.id
                                    )}
                                    onChange={() =>
                                      services.handleSelectRow(serviceItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {serviceItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {serviceItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {serviceItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getServiceStatusColor(
                                      serviceItem.status
                                    )}`}
                                  >
                                    {serviceItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.serviceId}
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

                      <Pagination
                        selectedCount={services.selectedRows.size}
                        totalCount={services.filteredData.length}
                        currentPage={services.currentPage}
                        totalPages={services.totalPages}
                        rowsPerPage={services.rowsPerPage}
                        onPageChange={services.handlePageChange}
                        onRowsPerPageChange={services.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {services.viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {services.displayedData?.map((serviceItem) => (
                        <Card key={serviceItem.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={serviceItem.image}
                                alt={serviceItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {serviceItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {serviceItem.name}
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
                                  serviceItem.status
                                )}`}
                              >
                                {serviceItem.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {serviceItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {serviceItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {serviceItem.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{serviceItem.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!services.showAll && services.filteredData.length > 5 && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => services.handleLoadAll()}
                        >
                          Load all ({services.filteredData.length})
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
                      Review all merchandise associated with your cemetery
                      services.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View</span>
                    <button
                      onClick={() => merchandise.setViewMode("cards")}
                      className={`p-2 rounded ${
                        merchandise.viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => merchandise.setViewMode("table")}
                      className={`p-2 rounded ${
                        merchandise.viewMode === "table"
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
                    onClick={() => merchandise.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(merchandise.filters.contractId || merchandise.filters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {merchandise.viewMode === "table" && (
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
                                    merchandise.paginatedData?.length > 0 &&
                                    merchandise.paginatedData.every((m) =>
                                      merchandise.selectedRows.has(m.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    merchandise.handleSelectAll(e.target.checked)
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
                            {merchandise.paginatedData?.map((merchandiseItem) => (
                              <tr
                                key={merchandiseItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandise.selectedRows.has(
                                      merchandiseItem.id
                                    )}
                                    onChange={() =>
                                      merchandise.handleSelectRow(merchandiseItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {merchandiseItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {merchandiseItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {merchandiseItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getMerchandiseStatusColor(
                                      merchandiseItem.status
                                    )}`}
                                  >
                                    {merchandiseItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.serviceId}
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

                      <Pagination
                        selectedCount={merchandise.selectedRows.size}
                        totalCount={merchandise.filteredData.length}
                        currentPage={merchandise.currentPage}
                        totalPages={merchandise.totalPages}
                        rowsPerPage={merchandise.rowsPerPage}
                        onPageChange={merchandise.handlePageChange}
                        onRowsPerPageChange={merchandise.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {merchandise.viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {merchandise.displayedData?.map((merchandiseItem) => (
                        <Card key={merchandiseItem.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={merchandiseItem.image}
                                alt={merchandiseItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {merchandiseItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {merchandiseItem.name}
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
                                  merchandiseItem.status
                                )}`}
                              >
                                {merchandiseItem.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {merchandiseItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {merchandiseItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {merchandiseItem.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              {merchandiseItem.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{merchandiseItem.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!merchandise.showAll &&
                      merchandise.filteredData.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => merchandise.handleLoadAll()}
                          >
                            Load all ({merchandise.filteredData.length})
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
                    onClick={() => services.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(services.filters.contractId || services.filters.status.length > 0) && (
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
                                    services.paginatedData?.length > 0 &&
                                    services.paginatedData.every((s) =>
                                      services.selectedRows.has(s.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    services.handleSelectAll(e.target.checked)
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
                            {services.paginatedData?.map((serviceItem) => (
                              <tr
                                key={serviceItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={services.selectedRows.has(
                                      serviceItem.id
                                    )}
                                    onChange={() =>
                                      services.handleSelectRow(serviceItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {serviceItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {serviceItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {serviceItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getServiceStatusColor(
                                      serviceItem.status
                                    )}`}
                                  >
                                    {serviceItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {serviceItem.serviceId}
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

                      <Pagination
                        selectedCount={services.selectedRows.size}
                        totalCount={services.filteredData.length}
                        currentPage={services.currentPage}
                        totalPages={services.totalPages}
                        rowsPerPage={services.rowsPerPage}
                        onPageChange={services.handlePageChange}
                        onRowsPerPageChange={services.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {services.displayedData?.map((serviceItem) => (
                        <Card key={serviceItem.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={serviceItem.image}
                                alt={serviceItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {serviceItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {serviceItem.name}
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
                                  serviceItem.status
                                )}`}
                              >
                                {serviceItem.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {serviceItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {serviceItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {serviceItem.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{serviceItem.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!services.showAll &&
                      services.filteredData.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => services.handleLoadAll()}
                          >
                            Load all ({services.filteredData.length})
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
                      Review all merchandise associated with your funeral
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
                    onClick={() => merchandise.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(merchandise.filters.contractId || merchandise.filters.status.length > 0) && (
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
                                    merchandise.paginatedData?.length > 0 &&
                                    merchandise.paginatedData.every((m) =>
                                      merchandise.selectedRows.has(m.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    merchandise.handleSelectAll(e.target.checked)
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
                            {merchandise.paginatedData?.map((merchandiseItem) => (
                              <tr
                                key={merchandiseItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandise.selectedRows.has(
                                      merchandiseItem.id
                                    )}
                                    onChange={() =>
                                      merchandise.handleSelectRow(merchandiseItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {merchandiseItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {merchandiseItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {merchandiseItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getMerchandiseStatusColor(
                                      merchandiseItem.status
                                    )}`}
                                  >
                                    {merchandiseItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {merchandiseItem.serviceId}
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

                      <Pagination
                        selectedCount={merchandise.selectedRows.size}
                        totalCount={merchandise.filteredData.length}
                        currentPage={merchandise.currentPage}
                        totalPages={merchandise.totalPages}
                        rowsPerPage={merchandise.rowsPerPage}
                        onPageChange={merchandise.handlePageChange}
                        onRowsPerPageChange={merchandise.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {merchandise.displayedData?.map((merchandiseItem) => (
                        <Card key={merchandiseItem.id}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={merchandiseItem.image}
                                alt={merchandiseItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {merchandiseItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                  {merchandiseItem.name}
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
                                  merchandiseItem.status
                                )}`}
                              >
                                {merchandiseItem.status}
                              </span>

                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {merchandiseItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {merchandiseItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {merchandiseItem.beneficiary.badge}
                                  </span>
                                </div>
                              </div>

                              {merchandiseItem.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{merchandiseItem.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {!merchandise.showAll &&
                      merchandise.filteredData.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => merchandise.handleLoadAll()}
                          >
                            Load all ({merchandise.filteredData.length})
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Filter Modal */}
      <FilterModal
        isOpen={services.showFilters}
        onClose={() => services.setShowFilters(false)}
        tempFilters={services.tempFilters}
        setTempFilters={services.setTempFilters}
        expandedSections={services.expandedFilters}
        onToggleSection={services.toggleFilterSection}
        onApply={services.handleApplyFilters}
        onCancel={services.handleCancelFilters}
        statusOptions={servicesStatusOptions}
      />

      {/* Merchandise Filter Modal */}
      <FilterModal
        isOpen={merchandise.showFilters}
        onClose={() => merchandise.setShowFilters(false)}
        tempFilters={merchandise.tempFilters}
        setTempFilters={merchandise.setTempFilters}
        expandedSections={merchandise.expandedFilters}
        onToggleSection={merchandise.toggleFilterSection}
        onApply={merchandise.handleApplyFilters}
        onCancel={merchandise.handleCancelFilters}
        statusOptions={merchandiseStatusOptions}
      />
    </div>
  );
};

export default Funeral;
