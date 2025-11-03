import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Layout, Search } from "lucide-react";
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

const Balance = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [funeralShowAll, setFuneralShowAll] = useState(false);
  const [cemeteryShowAll, setCemeteryShowAll] = useState(false);
  const funeralScrollRef = useRef(null);
  const cemeteryScrollRef = useRef(null);

  // Payment history table state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  // Owned property carousel state
  const [propertyShowAll, setPropertyShowAll] = useState(false);
  const propertyScrollRef = useRef(null);

  const {
    data: balanceResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: api.getBalance,
  });

  const balanceData = balanceResponse?.data;

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
      funeralScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleFuneralNext = () => {
    if (funeralScrollRef.current) {
      funeralScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleCemeteryPrev = () => {
    if (cemeteryScrollRef.current) {
      cemeteryScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleCemeteryNext = () => {
    if (cemeteryScrollRef.current) {
      cemeteryScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handlePropertyPrev = () => {
    if (propertyScrollRef.current) {
      propertyScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handlePropertyNext = () => {
    if (propertyScrollRef.current) {
      propertyScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Payment history pagination and selection handlers
  const totalPayments = balanceData?.paymentHistory.length || 0;
  const totalPages = Math.ceil(totalPayments / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPayments = balanceData?.paymentHistory.slice(startIndex, endIndex) || [];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(currentPayments.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const allCurrentPageSelected = currentPayments.length > 0 &&
    currentPayments.every(payment => selectedRows.includes(payment.id));

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="balance">Balance and invoices</TabsTrigger>
          <TabsTrigger value="statements">Statements and history</TabsTrigger>
          <TabsTrigger value="contracts">Contracts & Property</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-8">
        {/* Contact Section - Only show in "all" tab */}
        {activeTab === "all" && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact</h2>
            <p className="text-gray-600 mb-4">
              Please contact our support team for assistance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {balanceData?.contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEmailClick={() => handleComingSoon("Email contact")}
                  onPhoneClick={() => handleComingSoon("Phone contact")}
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
                  onPay={() => handleComingSoon("Payment")}
                  onPayOverdue={() => handleComingSoon("Overdue payment")}
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

            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Layout className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>

            {/* Invoice cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {balanceData?.additionalInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onPay={() => handleComingSoon("Payment")}
                  onPreview={() => handleComingSoon("Preview invoice")}
                  onDownload={() => handleComingSoon("Download invoice")}
                />
              ))}
            </div>
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
                {funeralShowAll ? 'Show less' : `See all (${balanceData?.accountStatements.funeral.length || 0})`}
              </button>
            </div>
            {funeralShowAll ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {balanceData?.accountStatements.funeral.map((statement, index) => (
                  <StatementCard
                    key={index}
                    statement={statement}
                    onPreview={() => handleComingSoon("Preview statement")}
                    onDownload={() => handleComingSoon("Download statement")}
                  />
                ))}
              </div>
            ) : (
              <div
                ref={funeralScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {balanceData?.accountStatements.funeral.map((statement, index) => (
                  <div key={index} className="flex-shrink-0 w-[calc(33.333%-0.67rem)]">
                    <StatementCard
                      statement={statement}
                      onPreview={() => handleComingSoon("Preview statement")}
                      onDownload={() => handleComingSoon("Download statement")}
                    />
                  </div>
                ))}
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
                {cemeteryShowAll ? 'Show less' : `See all (${balanceData?.accountStatements.cemetery.length || 0})`}
              </button>
            </div>
            {cemeteryShowAll ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {balanceData?.accountStatements.cemetery.map((statement, index) => (
                  <StatementCard
                    key={index}
                    statement={statement}
                    onPreview={() => handleComingSoon("Preview statement")}
                    onDownload={() => handleComingSoon("Download statement")}
                  />
                ))}
              </div>
            ) : (
              <div
                ref={cemeteryScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {balanceData?.accountStatements.cemetery.map((statement, index) => (
                  <div key={index} className="flex-shrink-0 w-[calc(33.333%-0.67rem)]">
                    <StatementCard
                      statement={statement}
                      onPreview={() => handleComingSoon("Preview statement")}
                      onDownload={() => handleComingSoon("Download statement")}
                    />
                  </div>
                ))}
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
              {/* Filters */}
              <div className="flex gap-3 mb-4">
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
                  <Layout className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={allCurrentPageSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
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
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedRows.includes(payment.id)}
                            onChange={(e) => handleSelectRow(payment.id, e.target.checked)}
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
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleComingSoon("Payment actions")}
                            className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <p>{selectedRows.length} of {totalPayments} row(s) selected.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={rowsPerPage}
                      onChange={(e) => handleRowsPerPageChange(e.target.value)}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <span>Page {currentPage} of {totalPages}</span>
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
            All contracts associated with your account, where you are an owner,
            next of kin or beneficiary.
          </p>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contract"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {balanceData?.contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onShare={() => handleComingSoon("Share contract")}
                onOpenContract={() => handleComingSoon("Open contract")}
              />
            ))}
          </div>
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
              {propertyShowAll ? 'Show less' : `See all (${balanceData?.ownedProperty.length || 0})`}
            </button>
          </div>

          {propertyShowAll ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {balanceData?.ownedProperty.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onMenuClick={() => handleComingSoon("Property menu")}
                />
              ))}
            </div>
          ) : (
            <div
              ref={propertyScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {balanceData?.ownedProperty.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-[calc(33.333%-0.67rem)]">
                  <PropertyCard
                    property={property}
                    onMenuClick={() => handleComingSoon("Property menu")}
                  />
                </div>
              ))}
            </div>
          )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Balance;
