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

const Balance = () => {
  const { addToast } = useToast();

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
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="balance">Balance and invoices</TabsTrigger>
          <TabsTrigger value="statements">Statements and history</TabsTrigger>
          <TabsTrigger value="contracts">Contracts & Property</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-8">
        {/* Contact Section */}
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

        {/* Contract Balances Section */}
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

        {/* Account Statements Section */}
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
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleComingSoon("See all statements")}
                className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                See all (12)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {balanceData?.accountStatements.funeral
                .slice(0, 3)
                .map((statement, index) => (
                  <StatementCard
                    key={index}
                    statement={statement}
                    onPreview={() => handleComingSoon("Preview statement")}
                    onDownload={() => handleComingSoon("Download statement")}
                  />
                ))}
            </div>
          </div>

          {/* Cemetery contract */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Cemetery contract
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleComingSoon("See all statements")}
                className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                See all (12)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {balanceData?.accountStatements.cemetery
                .slice(0, 3)
                .map((statement, index) => (
                  <StatementCard
                    key={index}
                    statement={statement}
                    onPreview={() => handleComingSoon("Preview statement")}
                    onDownload={() => handleComingSoon("Download statement")}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Payment History Section */}
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
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
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
                        <input type="checkbox" className="rounded" />
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
                    {balanceData?.paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input type="checkbox" className="rounded" />
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
                          <button className="text-gray-600 hover:bg-gray-100 p-1 rounded">
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
                <p>0 of 5 row(s) selected.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select className="border rounded px-2 py-1">
                      <option>5</option>
                      <option>10</option>
                      <option>20</option>
                    </select>
                  </div>
                  <span>Page 1 of 10</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contracts Section */}
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

        {/* Owned Property Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Owned property
          </h2>
          <p className="text-gray-600 mb-4">
            Owned land or Columbarium placements.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleComingSoon("See all properties")}
              className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              See all (12)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {balanceData?.ownedProperty.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onMenuClick={() => handleComingSoon("Property menu")}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Balance;
