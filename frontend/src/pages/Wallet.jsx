import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Eye,
  CreditCard,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const Wallet = () => {
  const { addToast } = useToast();

  const {
    data: walletResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.getWallet,
  });

  const walletData = walletResponse?.data;

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading wallet: {error.message}</p>
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
      <div className="mb-6 flex items-start justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">
            Here you can manage your payment methods. Connect existing methods
            to contracts or add new payment methods. By adding any payment
            method you agree with our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>
            .
          </p>
        </div>
        <Button
          onClick={() => handleComingSoon("Add payment method")}
          className="bg-black text-white hover:bg-gray-800"
        >
          Add payment method
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Contract related Payment method section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Contract related Payment method
            </h2>
            <p className="text-gray-600 mb-4">
              Cards and accounts that will be automatically charged for active
              PN contract. You can review legal documents below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {walletData?.contractPaymentMethods.map((contract, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contract{" "}
                      <span className="text-gray-600">
                        ID: {contract.contractId}
                      </span>
                    </h3>
                    {contract.hasPaymentMethod && (
                      <button
                        onClick={() => handleComingSoon("Edit payment method")}
                        className="text-sm font-medium text-gray-900 hover:text-gray-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!contract.hasPaymentMethod ? (
                    <Card className="border-2 border-dashed border-gray-300 shadow-none min-h-[280px]">
                      <CardContent className="p-12 flex flex-col items-center text-center justify-center min-h-[280px]">
                        <h4 className="text-xl font-semibold text-gray-900 mb-6">
                          Add payment method
                        </h4>
                        <p className="text-sm text-gray-600 mb-8 px-8">
                          That is crucial that you have a payment method to
                          ongoing contract. Next payment is due on{" "}
                          {contract.nextPaymentDue}
                        </p>
                        <Button
                          onClick={() => handleComingSoon("Add payment method")}
                          className="bg-black text-white hover:bg-gray-800 px-8"
                        >
                          Add method
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className=" h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {contract.paymentMethod.icon === "bank" ? (
                                <Building2 className="w-6 h-6 text-gray-600" />
                              ) : (
                                <CreditCard className="w-6 h-6 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                {contract.paymentMethod.type}
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {contract.paymentMethod.holderName}
                              </p>
                              <p className="text-sm text-gray-600">
                                **** {contract.paymentMethod.lastDigits}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleComingSoon("Payment method actions")
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        <div className="pt-4 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next Payment</span>
                            <span className="text-gray-900">
                              {contract.nextPayment.date}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount</span>
                            <span className="text-gray-900">
                              {formatCurrency(contract.nextPayment.amount)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* All methods section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              All methods
            </h2>
            <p className="text-gray-600 mb-4">
              Additional accounts that are not linked to any contract directly
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {walletData?.allMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Card</h3>
                      <button
                        onClick={() =>
                          handleComingSoon("Payment method actions")
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center">
                        {method.icon === "bank" ? (
                          <Building2 className="w-7 h-7 text-gray-600" />
                        ) : (
                          <CreditCard className="w-7 h-7 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {method.holderName}
                        </p>
                        <div className="flex items-center gap-2">
                          {method.icon === "card" && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                              VISA
                            </span>
                          )}
                          <p className="text-sm text-gray-600">
                            **** {method.lastDigits}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Legal documents section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Legal documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {walletData?.legalDocuments.map((doc) => (
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
                          <p className="text-sm text-gray-500">{doc.size}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleComingSoon("Preview document")}
                        >
                          Preview
                        </Button>
                        <button
                          onClick={() => handleComingSoon("Download document")}
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
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
