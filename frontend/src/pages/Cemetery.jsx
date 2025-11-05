import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
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
import DocumentViewer from "@/components/DocumentViewer";
import { useSectionData } from "@/hooks/useSectionData";
import FilterModal from "@/components/cemetery/FilterModal";
import Pagination from "@/components/cemetery/Pagination";

const Cemetery = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'cards' or 'table' - for dedicated tabs
  const [designationTab, setDesignationTab] = useState("signed");

  // Document viewer state
  const [viewerDocument, setViewerDocument] = useState(null);

  // Signed document upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    data: cemeteryResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cemetery"],
    queryFn: api.getCemetery,
  });

  const cemeteryData = cemeteryResponse?.data;

  // Use custom hook for Property section
  const property = useSectionData(cemeteryData?.properties || [], 5);

  // Use custom hook for Services section
  const services = useSectionData(cemeteryData?.services || [], 5);

  // Use custom hook for Merchandise section
  const merchandise = useSectionData(cemeteryData?.merchandise || [], 5);

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  // Document handlers
  const handlePreviewDocument = (doc) => {
    setViewerDocument({
      url: `/example-pdfs/${doc.fileName}`,
      name: doc.name,
      fileName: doc.fileName
    });
  };

  const handleDownloadDocument = (doc) => {
    const url = `/example-pdfs/${doc.fileName}`;
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

  // Signed document upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else if (file) {
      addToast('Please select a PDF file', 'error');
      e.target.value = '';
    }
  };

  const handleSendToCounselor = () => {
    if (!uploadedFile) {
      addToast('Please select a file to send', 'error');
      return;
    }

    // Clear the file input and state
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show success message
    addToast('Document sent to counselor successfully', 'success');
  };

  // Helper functions for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "In Trust":
        return "bg-blue-100 text-blue-800";
      case "Not Purchased":
        return "bg-red-100 text-red-800";
      case "Used":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceStatusColor = getStatusColor;
  const getMerchandiseStatusColor = getStatusColor;

  // Status options for filters
  const propertyStatusOptions = ["In Trust", "Not Purchased", "Used", "Paid"];
  const servicesStatusOptions = ["Paid", "Pending", "In Trust"];
  const merchandiseStatusOptions = ["Paid", "Not Purchased", "Used"];

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
                      onClick={() => property.setViewMode("cards")}
                      className={`p-2 rounded ${
                        property.viewMode === "cards"
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => property.setViewMode("table")}
                      className={`p-2 rounded ${
                        property.viewMode === "table"
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
                    onClick={() => property.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(property.filters.contractId || property.filters.status.length > 0) && (
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
                    )}
                  </Button>
                </div>

                {/* Table View */}
                {property.viewMode === "table" && (
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
                                    property.paginatedData?.length > 0 &&
                                    property.paginatedData.every((p) =>
                                      property.selectedRows.has(p.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    property.handleSelectAll(e.target.checked)
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
                            {property.paginatedData?.map((propertyItem) => (
                              <tr
                                key={propertyItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={property.selectedRows.has(propertyItem.id)}
                                    onChange={() =>
                                      property.handleSelectRow(propertyItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {propertyItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {propertyItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {propertyItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getStatusColor(
                                      propertyItem.status
                                    )}`}
                                  >
                                    {propertyItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.serviceId}
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

                      <Pagination
                        selectedCount={property.selectedRows.size}
                        totalCount={property.filteredData.length}
                        currentPage={property.currentPage}
                        totalPages={property.totalPages}
                        rowsPerPage={property.rowsPerPage}
                        onPageChange={property.handlePageChange}
                        onRowsPerPageChange={property.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {property.viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {property.displayedData?.map((propertyItem) => (
                        <Card key={propertyItem.id}>
                          <CardContent className="p-0">
                            {/* Contract ID Badge */}
                            <div className="relative">
                              <img
                                src={propertyItem.image}
                                alt={propertyItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {propertyItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              {/* Title and Status */}
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {propertyItem.name}
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
                                  propertyItem.status
                                )}`}
                              >
                                {propertyItem.status}
                              </span>

                              {/* Beneficiary */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {propertyItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {propertyItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {propertyItem.beneficiary.badge}
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

                    {/* Load All Button */}
                    {!property.showAll &&
                      property.filteredData.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={property.handleLoadAll}
                          >
                            Load all ({property.filteredData.length})
                          </Button>
                        </div>
                      )}
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
                                  handlePreviewDocument({
                                    name: "Signed Cemetery Document",
                                    fileName: "my_services_cemetery_signed_doc.pdf"
                                  })
                                }
                              >
                                Preview
                              </Button>
                              <button
                                onClick={() =>
                                  handleDownloadDocument({
                                    name: "Signed Cemetery Document",
                                    fileName: "my_services_cemetery_signed_doc.pdf"
                                  })
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
                                  handlePreviewDocument({
                                    name: "Example Cemetery Document Template",
                                    fileName: "my_services_cemetery_signed_doc_example.pdf"
                                  })
                                }
                              >
                                Preview
                              </Button>
                              <button
                                onClick={() =>
                                  handleDownloadDocument({
                                    name: "Example Cemetery Document Template",
                                    fileName: "my_services_cemetery_signed_doc_example.pdf"
                                  })
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
                            <Input
                              type="file"
                              accept=".pdf,application/pdf"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleSendToCounselor}
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
                            {merchandise.paginatedData?.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandise.selectedRows.has(
                                      item.id
                                    )}
                                    onChange={() =>
                                      merchandise.handleSelectRow(item.id)
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
                      {merchandise.displayedData?.map((item) => (
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
                    onClick={() => property.setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(property.filters.contractId || property.filters.status.length > 0) && (
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
                                    property.paginatedData?.length > 0 &&
                                    property.paginatedData.every((p) =>
                                      property.selectedRows.has(p.id)
                                    )
                                  }
                                  onChange={(e) =>
                                    property.handleSelectAll(e.target.checked)
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
                            {property.paginatedData?.map((propertyItem) => (
                              <tr
                                key={propertyItem.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={property.selectedRows.has(propertyItem.id)}
                                    onChange={() =>
                                      property.handleSelectRow(propertyItem.id)
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.contractId}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.name}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {propertyItem.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {propertyItem.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">
                                      {propertyItem.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.dateTime}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-3 py-1 text-sm rounded font-medium ${getStatusColor(
                                      propertyItem.status
                                    )}`}
                                  >
                                    {propertyItem.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {propertyItem.serviceId}
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

                      <Pagination
                        selectedCount={property.selectedRows.size}
                        totalCount={property.filteredData.length}
                        currentPage={property.currentPage}
                        totalPages={property.totalPages}
                        rowsPerPage={property.rowsPerPage}
                        onPageChange={property.handlePageChange}
                        onRowsPerPageChange={property.handleRowsPerPageChange}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {property.displayedData?.map((propertyItem) => (
                        <Card key={propertyItem.id}>
                          <CardContent className="p-0">
                            {/* Contract ID Badge */}
                            <div className="relative">
                              <img
                                src={propertyItem.image}
                                alt={propertyItem.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-medium rounded">
                                  Contract ID: {propertyItem.contractId}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              {/* Title and Status */}
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {propertyItem.name}
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
                                  propertyItem.status
                                )}`}
                              >
                                {propertyItem.status}
                              </span>

                              {/* Beneficiary */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-purple-700">
                                    {propertyItem.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {propertyItem.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded font-medium">
                                    {propertyItem.beneficiary.badge}
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

                    {/* Load All Button */}
                    {!property.showAll &&
                      property.filteredData.length > 5 && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={property.handleLoadAll}
                          >
                            Load all ({property.filteredData.length})
                          </Button>
                        </div>
                      )}
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
                            {/* Service Image */}
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
                              {/* Title and Status */}
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

                              {/* Beneficiary */}
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

                              {/* Location */}
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{serviceItem.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Load All Button */}
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
                            {merchandise.paginatedData?.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={merchandise.selectedRows.has(
                                      item.id
                                    )}
                                    onChange={() =>
                                      merchandise.handleSelectRow(item.id)
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
                      {merchandise.displayedData?.map((item) => (
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
      <FilterModal
        isOpen={property.showFilters}
        onClose={() => property.setShowFilters(false)}
        tempFilters={property.tempFilters}
        setTempFilters={property.setTempFilters}
        expandedSections={property.expandedFilters}
        onToggleSection={property.toggleFilterSection}
        onApply={property.handleApplyFilters}
        onCancel={property.handleCancelFilters}
        statusOptions={propertyStatusOptions}
      />

      {/* Services Filters Modal */}
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

      {/* Merchandise Filters Modal */}
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

export default Cemetery;
