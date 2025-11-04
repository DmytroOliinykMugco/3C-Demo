import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Layout,
  Search,
  Download as DownloadIcon,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import ContactCard from "@/components/ContactCard";
import ContractBalanceCard from "@/components/ContractBalanceCard";
import StatementCard from "@/components/StatementCard";
import ContractCard from "@/components/ContractCard";
import PropertyCard from "@/components/PropertyCard";
import InvoiceCard from "@/components/InvoiceCard";
import DocumentViewer from "@/components/DocumentViewer";

const Balance = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [funeralShowAll, setFuneralShowAll] = useState(false);
  const [cemeteryShowAll, setCemeteryShowAll] = useState(false);
  const funeralScrollRef = useRef(null);
  const cemeteryScrollRef = useRef(null);

  // Payment history table state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [contractSearchQuery, setContractSearchQuery] = useState("");

  // Owned property carousel state
  const [propertyShowAll, setPropertyShowAll] = useState(false);
  const propertyScrollRef = useRef(null);

  // Additional Invoices state
  const [invoiceViewMode, setInvoiceViewMode] = useState("grid"); // grid or list
  const [invoiceFilters, setInvoiceFilters] = useState({
    status: "all", // all, paid, unpaid, overdue
    dateRange: "all", // all, thisMonth, lastMonth, thisYear
  });

  // Payment History state
  const [historyViewMode, setHistoryViewMode] = useState("table"); // table or cards
  const [historyFilters, setHistoryFilters] = useState({
    contractType: ["funeral", "cemetery"], // array of selected types
    contractNumber: "",
    paymentMethod: [],
    amountMin: 0,
    amountMax: 30000,
  });
  const [tempFilters, setTempFilters] = useState({
    contractType: ["funeral", "cemetery"],
    contractNumber: "",
    paymentMethod: [],
    amountMin: 0,
    amountMax: 30000,
  });
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({
    contractType: true,
    contractNumber: false,
    paymentMethod: false,
    amount: false,
  });

  // Loading states
  const [downloadingStatements, setDownloadingStatements] = useState({});
  const [payingContracts, setPayingContracts] = useState({});
  const [exportingHistory, setExportingHistory] = useState(false);

  // Document viewer state
  const [viewerDocument, setViewerDocument] = useState(null);

  const {
    data: balanceResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: api.getBalance,
  });

  const balanceData = balanceResponse?.data;

  // Mock payment handler
  const handlePay = async (contractId) => {
    setPayingContracts({ ...payingContracts, [contractId]: true });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPayingContracts({ ...payingContracts, [contractId]: false });
    addToast("Payment processed successfully!", "success");
  };

  // Mock statement download
  const handleDownloadStatement = async (statementId, url) => {
    setDownloadingStatements({ ...downloadingStatements, [statementId]: true });

    try {
      // Fetch the file as a blob to force download
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `statement-${statementId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      setDownloadingStatements({ ...downloadingStatements, [statementId]: false });
      addToast("Statement downloaded successfully!", "success");
    } catch (error) {
      setDownloadingStatements({ ...downloadingStatements, [statementId]: false });
      addToast("Failed to download statement", "error");
    }
  };

  // Statement preview (open in viewer)
  const handlePreviewStatement = (statement, url) => {
    setViewerDocument({
      id: statement.id || statement.title,
      name: statement.title,
      url: url
    });
  };

  // Email contact handler
  const handleEmailContact = (email) => {
    window.location.href = `mailto:${email}?subject=Support Request`;
  };

  // Phone contact handler
  const handlePhoneContact = (phone) => {
    // Remove any spaces or formatting from phone
    const cleanPhone = phone.replace(/\s+/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  // Open contract details
  const handleOpenContract = (contractId) => {
    const contract = balanceData?.contracts.find(c => c.id === contractId);
    if (contract) {
      addToast(`Opening ${contract.type} contract...`, "success");
      // In real app: navigate(`/contracts/${contractId}`);
      // For now, navigate to the appropriate page based on contract type
      setTimeout(() => {
        if (contract.type.toLowerCase().includes("funeral")) {
          navigate("/funeral");
        } else if (contract.type.toLowerCase().includes("cemetery")) {
          navigate("/cemetery");
        }
      }, 500);
    }
  };

  // Share contract
  const handleShareContract = async (contractId) => {
    const contract = balanceData?.contracts.find(c => c.id === contractId);
    if (contract) {
      // Mock share link
      const shareLink = `${window.location.origin}/contracts/${contractId}`;

      // Try to use Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${contract.type} Contract`,
            text: `Check out this ${contract.type} contract`,
            url: shareLink,
          });
          addToast("Contract shared successfully!", "success");
        } catch (err) {
          if (err.name !== "AbortError") {
            // Fallback to copying link
            copyToClipboard(shareLink);
          }
        }
      } else {
        // Fallback to copying link
        copyToClipboard(shareLink);
      }
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast("Contract link copied to clipboard!", "success");
    }).catch(() => {
      addToast("Failed to copy link", "error");
    });
  };

  // Toggle invoice view mode
  const toggleInvoiceView = () => {
    setInvoiceViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    addToast(`Switched to ${invoiceViewMode === "grid" ? "list" : "grid"} view`, "success");
  };

  // Toggle history view mode
  const toggleHistoryView = () => {
    setHistoryViewMode((prev) => (prev === "table" ? "cards" : "table"));
    addToast(`Switched to ${historyViewMode === "table" ? "cards" : "table"} view`, "success");
  };

  // Handle invoice filter changes
  const handleInvoiceFilterChange = (filterType, value) => {
    setInvoiceFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Handle temp filter checkbox changes (for modal)
  const handleTempFilterToggle = (filterType, value) => {
    setTempFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  // Toggle filter section expansion
  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Open filters modal (load current filters into temp)
  const openHistoryFilters = () => {
    setTempFilters({ ...historyFilters });
    setShowHistoryFilters(true);
  };

  // Apply filters (save temp to actual)
  const applyHistoryFilters = () => {
    setHistoryFilters({ ...tempFilters });
    setShowHistoryFilters(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Cancel filters (close without applying)
  const cancelHistoryFilters = () => {
    setShowHistoryFilters(false);
  };

  // Property menu actions
  const handlePropertyMenu = (property) => {
    // In a real app, this would open a dropdown menu with options
    // For now, we'll show a mock menu via toast
    const actions = [
      "View Details",
      "Edit Property",
      "Share",
      "Download Documents",
      "View on Map"
    ];

    // Mock: Just show that menu was opened
    // In real app, would show a dropdown/modal with these options
    addToast(`Property menu opened for ${property.type}`, "success");

    // For demo purposes, you could implement actual actions:
    // - View Details: Show property details modal
    // - Edit: Navigate to edit page
    // - Share: Copy link to clipboard
    // - Download: Download property documents
    // - View on Map: Open map with property location
  };

  // Export payment history
  const handleExportHistory = async () => {
    if (selectedRows.length === 0) {
      addToast("Please select rows to export", "error");
      return;
    }

    setExportingHistory(true);

    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create CSV content
    const selectedPayments = balanceData?.paymentHistory.filter(p =>
      selectedRows.includes(p.id)
    );

    const csvContent = [
      ["Contract ID", "Date & Time", "Beneficiary", "Payment Method", "Amount", "Balance"],
      ...selectedPayments.map(p => [
        p.contractId,
        p.dateTime,
        p.beneficiary.name,
        p.paymentMethod,
        p.amount,
        p.balance
      ])
    ].map(row => row.join(",")).join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    setExportingHistory(false);
    addToast(`Exported ${selectedRows.length} payment(s) successfully!`, "success");
  };

  // Preview document in viewer
  const handlePreviewDocument = (doc) => {
    setViewerDocument(doc);
  };

  const handleCloseViewer = () => {
    setViewerDocument(null);
  };

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading balance: {error.message}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleFuneralPrev = () => {
    if (funeralScrollRef.current) {
      funeralScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const handleFuneralNext = () => {
    if (funeralScrollRef.current) {
      funeralScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const handleCemeteryPrev = () => {
    if (cemeteryScrollRef.current) {
      cemeteryScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const handleCemeteryNext = () => {
    if (cemeteryScrollRef.current) {
      cemeteryScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const handlePropertyPrev = () => {
    if (propertyScrollRef.current) {
      propertyScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const handlePropertyNext = () => {
    if (propertyScrollRef.current) {
      propertyScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Filter invoices
  const filteredInvoices = balanceData?.additionalInvoices.filter((invoice) => {
    // Status filter
    if (invoiceFilters.status !== "all" && invoice.status !== invoiceFilters.status) {
      return false;
    }
    // Date range filter (mock implementation)
    if (invoiceFilters.dateRange !== "all") {
      // In real app, would filter by actual dates
    }
    return true;
  }) || [];

  // Payment history pagination and selection handlers with filtering
  const filteredPayments = balanceData?.paymentHistory.filter((payment) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        payment.contractId.toLowerCase().includes(query) ||
        payment.beneficiary.name.toLowerCase().includes(query) ||
        payment.paymentMethod.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Contract type filter (checkbox based) - Check for FU (funeral) or CE (cemetery)
    if (historyFilters.contractType.length > 0 && historyFilters.contractType.length < 2) {
      const contractType = payment.contractId.toUpperCase().startsWith("FU") ? "funeral" : "cemetery";
      if (!historyFilters.contractType.includes(contractType)) return false;
    }

    // Contract number filter (text input)
    if (historyFilters.contractNumber) {
      if (!payment.contractId.toLowerCase().includes(historyFilters.contractNumber.toLowerCase())) {
        return false;
      }
    }

    // Payment method filter (checkbox based)
    if (historyFilters.paymentMethod.length > 0) {
      const method = payment.paymentMethod.toLowerCase();
      let matches = false;

      for (const selectedMethod of historyFilters.paymentMethod) {
        if (selectedMethod === "card") {
          // Card payments have ** followed by numbers
          if (method.includes("**")) {
            matches = true;
            break;
          }
        } else if (selectedMethod === "cash") {
          // Cash payments contain "cash"
          if (method.includes("cash")) {
            matches = true;
            break;
          }
        } else if (selectedMethod === "bank") {
          // Bank transfers
          if (method.includes("bank") || method.includes("transfer") || method.includes("ach") || method.includes("wire")) {
            matches = true;
            break;
          }
        }
      }

      if (!matches) return false;
    }

    // Amount filter (range)
    if (payment.amount < historyFilters.amountMin || payment.amount > historyFilters.amountMax) {
      return false;
    }

    return true;
  }) || [];

  const totalPayments = filteredPayments.length;
  const totalPages = Math.ceil(totalPayments / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Filter contracts
  const filteredContracts = balanceData?.contracts.filter((contract) => {
    if (!contractSearchQuery) return true;
    const query = contractSearchQuery.toLowerCase();
    return (
      contract.id.toLowerCase().includes(query) ||
      contract.role.toLowerCase().includes(query) ||
      contract.status.toLowerCase().includes(query)
    );
  }) || [];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(currentPayments.map((p) => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const allCurrentPageSelected =
    currentPayments.length > 0 &&
    currentPayments.every((payment) => selectedRows.includes(payment.id));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance</h1>
        <p className="text-gray-600">
          Here you can view your current balance, payment methods, transaction
          history, and legal documents.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="balance">Balance and invoices</TabsTrigger>
              <TabsTrigger value="statements">
                Statements and history
              </TabsTrigger>
              <TabsTrigger value="contracts">Contracts & Property</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-8">
            {/* Contact Section - Only show in "all" tab */}
            {activeTab === "all" && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Contact
                </h2>
                <p className="text-gray-600 mb-4">
                  Please contact our support team for assistance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {balanceData?.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEmailClick={() => handleEmailContact(contact.email)}
                      onPhoneClick={() => handlePhoneContact(contact.phone)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Contract Balances Section - Show in "all" and "balance" tabs */}
            {(activeTab === "all" || activeTab === "balance") && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contract balances
                </h2>
                <div className="space-y-4">
                  {balanceData?.contractBalances.map((contract) => (
                    <ContractBalanceCard
                      key={contract.id}
                      contract={contract}
                      onPay={() => handlePay(contract.id)}
                      onPayOverdue={() => handlePay(contract.id)}
                      isLoading={payingContracts[contract.id]}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Additional Invoices Section - Show only in "balance" tab */}
            {activeTab === "balance" && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Additional Invoices
                </h2>
                <p className="text-gray-600 mb-4">
                  Invoices associated with completed contract or no contract
                </p>

                {/* Filters and View Toggle */}
                <div className="flex gap-3 mb-6 flex-wrap">
                  <div className="flex gap-2">
                    <select
                      className="border rounded px-3 py-1.5 text-sm"
                      value={invoiceFilters.status}
                      onChange={(e) =>
                        handleInvoiceFilterChange("status", e.target.value)
                      }
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <select
                      className="border rounded px-3 py-1.5 text-sm"
                      value={invoiceFilters.dateRange}
                      onChange={(e) =>
                        handleInvoiceFilterChange("dateRange", e.target.value)
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleInvoiceView}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    {invoiceViewMode === "grid" ? "List" : "Grid"} View
                  </Button>
                </div>

                {/* Invoice cards */}
                <div
                  className={
                    invoiceViewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {filteredInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onPay={() => handlePay(invoice.id)}
                      onPreview={() => handlePreviewDocument({
                        id: invoice.id,
                        name: `Invoice ${invoice.id}`,
                        url: `http://localhost:3000/example-pdfs/information_pdf_example_1.pdf`
                      })}
                      onDownload={() => handleDownloadStatement(invoice.id, `http://localhost:3000/example-pdfs/information_pdf_example_1.pdf`)}
                      isLoading={downloadingStatements[invoice.id]}
                    />
                  ))}
                </div>
                {filteredInvoices.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No invoices found matching the selected filters.
                  </div>
                )}
              </section>
            )}

            {/* Account Statements Section - Show in "all" and "statements" tabs */}
            {(activeTab === "all" || activeTab === "statements") && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Account Statements
                </h2>

                {/* Funeral contract */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Funeral contract
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {!funeralShowAll && (
                      <>
                        <button
                          onClick={handleFuneralPrev}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={handleFuneralNext}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setFuneralShowAll(!funeralShowAll)}
                      className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                    >
                      {funeralShowAll
                        ? "Show less"
                        : `See all (${
                            balanceData?.accountStatements.funeral.length || 0
                          })`}
                    </button>
                  </div>
                  {funeralShowAll ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {balanceData?.accountStatements.funeral.map(
                        (statement, index) => (
                          <StatementCard
                            key={index}
                            statement={statement}
                            onPreview={() =>
                              handlePreviewStatement(statement, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_funeral_contract.pdf`)
                            }
                            onDownload={() =>
                              handleDownloadStatement(`funeral-${index}`, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_funeral_contract.pdf`)
                            }
                            isLoading={downloadingStatements[`funeral-${index}`]}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      ref={funeralScrollRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {balanceData?.accountStatements.funeral.map(
                        (statement, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-[calc(33.333%-0.67rem)]"
                          >
                            <StatementCard
                              statement={statement}
                              onPreview={() =>
                                handlePreviewStatement(statement, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_funeral_contract.pdf`)
                              }
                              onDownload={() =>
                                handleDownloadStatement(`funeral-${index}`, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_funeral_contract.pdf`)
                              }
                              isLoading={downloadingStatements[`funeral-${index}`]}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Cemetery contract */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Cemetery contract
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {!cemeteryShowAll && (
                      <>
                        <button
                          onClick={handleCemeteryPrev}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={handleCemeteryNext}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setCemeteryShowAll(!cemeteryShowAll)}
                      className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                    >
                      {cemeteryShowAll
                        ? "Show less"
                        : `See all (${
                            balanceData?.accountStatements.cemetery.length || 0
                          })`}
                    </button>
                  </div>
                  {cemeteryShowAll ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {balanceData?.accountStatements.cemetery.map(
                        (statement, index) => (
                          <StatementCard
                            key={index}
                            statement={statement}
                            onPreview={() =>
                              handlePreviewStatement(statement, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_cemetery_contract.pdf`)
                            }
                            onDownload={() =>
                              handleDownloadStatement(`cemetery-${index}`, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_cemetery_contract.pdf`)
                            }
                            isLoading={downloadingStatements[`cemetery-${index}`]}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      ref={cemeteryScrollRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {balanceData?.accountStatements.cemetery.map(
                        (statement, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-[calc(33.333%-0.67rem)]"
                          >
                            <StatementCard
                              statement={statement}
                              onPreview={() =>
                                handlePreviewStatement(statement, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_cemetery_contract.pdf`)
                              }
                              onDownload={() =>
                                handleDownloadStatement(`cemetery-${index}`, `http://localhost:3000/example-pdfs/my_services_balance_account_statements_cemetery_contract.pdf`)
                              }
                              isLoading={downloadingStatements[`cemetery-${index}`]}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Payment History Section - Show in "all" and "statements" tabs */}
            {(activeTab === "all" || activeTab === "statements") && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Payment history
                </h2>
                <p className="text-gray-600 mb-4">
                  All payments for all contracts are listed below.
                </p>

                <Card>
                  <CardContent className="p-6">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openHistoryFilters}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleHistoryView}
                      >
                        <Layout className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportHistory}
                        disabled={selectedRows.length === 0 || exportingHistory}
                      >
                        {exportingHistory ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Export
                          </>
                        )}
                      </Button>
                    </div>

                    {/* No results message */}
                    {filteredPayments.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No payments found matching the selected filters.
                      </div>
                    ) : (
                      <>
                        {/* Table or Cards View */}
                        {historyViewMode === "table" ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  className="rounded"
                                  checked={allCurrentPageSelected}
                                  onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                  }
                                />
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Contract
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Beneficiaries
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Date & Time
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Payment method
                              </th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                Amount
                              </th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                Balance
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPayments.map((payment) => (
                              <tr
                                key={payment.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={selectedRows.includes(payment.id)}
                                    onChange={(e) =>
                                      handleSelectRow(
                                        payment.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  ID: {payment.contractId}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-xs font-semibold text-gray-700">
                                        {payment.beneficiary.initials}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-900">
                                      {payment.beneficiary.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded">
                                      {payment.beneficiary.badge}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {payment.dateTime}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {payment.paymentMethod}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                  {formatCurrency(payment.balance)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentPayments.map((payment) => (
                          <Card key={payment.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-2 mb-3">
                                <input
                                  type="checkbox"
                                  className="rounded mt-1"
                                  checked={selectedRows.includes(payment.id)}
                                  onChange={(e) =>
                                    handleSelectRow(
                                      payment.id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {payment.contractId}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {payment.dateTime}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {payment.beneficiary.initials}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {payment.beneficiary.name}
                                  </p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded">
                                    {payment.beneficiary.badge}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    {payment.paymentMethod}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(payment.amount)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">Balance</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(payment.balance)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                      <p>
                        {selectedRows.length} of {totalPayments} row(s)
                        selected.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span>Rows per page</span>
                          <select
                            className="border rounded px-2 py-1"
                            value={rowsPerPage}
                            onChange={(e) =>
                              handleRowsPerPageChange(e.target.value)
                            }
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Contracts Section - Show in "all" and "contracts" tabs */}
            {(activeTab === "all" || activeTab === "contracts") && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Contracts
                </h2>
                <p className="text-gray-600 mb-4">
                  All contracts associated with your account, where you are an
                  owner, next of kin or beneficiary.
                </p>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search contract"
                      value={contractSearchQuery}
                      onChange={(e) => setContractSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      onShare={() => handleShareContract(contract.id)}
                      onOpenContract={() => handleOpenContract(contract.id)}
                    />
                  ))}
                </div>
                {filteredContracts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No contracts found matching your search.
                  </div>
                )}
              </section>
            )}

            {/* Owned Property Section - Show in "all" and "contracts" tabs */}
            {(activeTab === "all" || activeTab === "contracts") && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Owned property
                </h2>
                <p className="text-gray-600 mb-4">
                  Owned land or Columbarium placements.
                </p>

                <div className="flex items-center gap-2 mb-4">
                  {!propertyShowAll && (
                    <>
                      <button
                        onClick={handlePropertyPrev}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handlePropertyNext}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPropertyShowAll(!propertyShowAll)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    {propertyShowAll
                      ? "Show less"
                      : `See all (${balanceData?.ownedProperty.length || 0})`}
                  </button>
                </div>

                {propertyShowAll ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {balanceData?.ownedProperty.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onMenuClick={() => handlePropertyMenu(property)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    ref={propertyScrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {balanceData?.ownedProperty.map((property) => (
                      <div
                        key={property.id}
                        className="flex-shrink-0 w-[calc(33.333%-0.67rem)]"
                      >
                        <PropertyCard
                          property={property}
                          onMenuClick={() => handlePropertyMenu(property)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History Filters Modal */}
      {showHistoryFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
          <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Table filters
                </h3>
                <button
                  onClick={() => setShowHistoryFilters(false)}
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
                {/* Contract Type Filter */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleFilterSection("contractType")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contract type</span>
                      {tempFilters.contractType.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {tempFilters.contractType.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFilters.contractType ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFilters.contractType && (
                    <div className="px-4 pb-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempFilters.contractType.includes("funeral")}
                          onChange={() =>
                            handleTempFilterToggle("contractType", "funeral")
                          }
                        />
                        <span className="text-sm text-gray-700">Funeral</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempFilters.contractType.includes("cemetery")}
                          onChange={() =>
                            handleTempFilterToggle("contractType", "cemetery")
                          }
                        />
                        <span className="text-sm text-gray-700">Cemetery</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Contract Number Filter */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleFilterSection("contractNumber")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contract number</span>
                      {tempFilters.contractNumber && (
                        <span className="text-sm text-gray-500">1</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFilters.contractNumber ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFilters.contractNumber && (
                    <div className="px-4 pb-4">
                      <Input
                        type="text"
                        placeholder="Search by contract number..."
                        value={tempFilters.contractNumber}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            contractNumber: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method Filter */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleFilterSection("paymentMethod")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Payment method</span>
                      {tempFilters.paymentMethod.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {tempFilters.paymentMethod.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFilters.paymentMethod ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFilters.paymentMethod && (
                    <div className="px-4 pb-4 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempFilters.paymentMethod.includes("card")}
                          onChange={() =>
                            handleTempFilterToggle("paymentMethod", "card")
                          }
                        />
                        <span className="text-sm text-gray-700">Card</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempFilters.paymentMethod.includes("bank")}
                          onChange={() =>
                            handleTempFilterToggle("paymentMethod", "bank")
                          }
                        />
                        <span className="text-sm text-gray-700">Bank Transfer</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded accent-black"
                          checked={tempFilters.paymentMethod.includes("cash")}
                          onChange={() =>
                            handleTempFilterToggle("paymentMethod", "cash")
                          }
                        />
                        <span className="text-sm text-gray-700">Cash</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Amount Filter */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleFilterSection("amount")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Amount</span>
                      {(tempFilters.amountMin > 0 || tempFilters.amountMax < 30000) && (
                        <span className="text-sm text-gray-500">1</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFilters.amount ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFilters.amount && (
                    <div className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 text-center mb-2">
                          Set your budget range (${tempFilters.amountMin.toLocaleString()} - $
                          {tempFilters.amountMax.toLocaleString()}).
                        </div>
                        <div className="relative pt-2">
                          <div className="relative h-2">
                            {/* Track background */}
                            <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>
                            {/* Active range highlight */}
                            <div
                              className="absolute h-2 bg-gray-300 rounded-full"
                              style={{
                                left: `${(tempFilters.amountMin / 30000) * 100}%`,
                                right: `${100 - (tempFilters.amountMax / 30000) * 100}%`,
                              }}
                            ></div>
                            {/* Min range input */}
                            <input
                              type="range"
                              min={0}
                              max={30000}
                              step={100}
                              value={tempFilters.amountMin}
                              onChange={(e) =>
                                setTempFilters((prev) => ({
                                  ...prev,
                                  amountMin: Math.min(
                                    Number(e.target.value),
                                    prev.amountMax
                                  ),
                                }))
                              }
                              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
                              style={{ zIndex: tempFilters.amountMin > 29000 ? 5 : 3 }}
                            />
                            {/* Max range input */}
                            <input
                              type="range"
                              min={0}
                              max={30000}
                              step={100}
                              value={tempFilters.amountMax}
                              onChange={(e) =>
                                setTempFilters((prev) => ({
                                  ...prev,
                                  amountMax: Math.max(
                                    Number(e.target.value),
                                    prev.amountMin
                                  ),
                                }))
                              }
                              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
                              style={{ zIndex: 4 }}
                            />
                          </div>
                        </div>
                      </div>
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
                  onClick={cancelHistoryFilters}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={applyHistoryFilters}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewerDocument && (
        <DocumentViewer
          documentUrl={viewerDocument.url}
          documentName={viewerDocument.name}
          onClose={handleCloseViewer}
          onDownload={() => {
            window.open(viewerDocument.url, "_blank");
          }}
        />
      )}
    </div>
  );
};

export default Balance;
