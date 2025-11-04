import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Eye,
  CreditCard,
  Building2,
  MoreHorizontal,
  X,
  ChevronDown,
  Check,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

// Formatting functions
const formatCardNumber = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  // Limit to 16 digits
  const limited = cleaned.substring(0, 16);
  // Add space after every 4 digits
  const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
  return formatted;
};

const formatEndDate = (value) => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  // Limit to 4 digits (MMYY)
  const limited = cleaned.substring(0, 4);
  // Add slash after 2 digits
  if (limited.length >= 3) {
    return limited.substring(0, 2) + '/' + limited.substring(2);
  }
  return limited;
};

// Validation functions
const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
};

const validateEndDate = (endDate) => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(endDate)) {
    return false;
  }
  // Check if date is not in the past
  const [month, year] = endDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  return expiry > now;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length >= 10;
};

const Wallet = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Payment method modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 or 2
  const [paymentType, setPaymentType] = useState(""); // "card" or "bank"
  const [expandedSections, setExpandedSections] = useState({
    cardDetails: true,
    cardholderName: false,
    billingAddress: false,
    accountHolder: true,
    contactInfo: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    // Card fields
    cardNumber: "",
    endDate: "",
    cvv: "",
    cardholderName: "",
    // Bank fields
    accountHolderType: "Individual",
    accountType: "Checking",
    fullLegalName: "",
    // Common fields
    country: "USA",
    address: "",
    zipCode: "",
    email: "",
    phoneNumber: "",
  });

  const {
    data: walletResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.getWallet,
  });

  const walletData = walletResponse?.data;

  // Mutation for adding payment method
  const addPaymentMutation = useMutation({
    mutationFn: ({ type, formData }) => api.addPaymentMethod(type, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["wallet"]);
      addToast("Payment method added successfully!", "success");
      closePaymentModal();
    },
    onError: () => {
      addToast("Failed to add payment method", "error");
    }
  });

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
  };

  // Modal handlers
  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setCurrentStep(1);
    setPaymentType("");
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentStep(1);
    setPaymentType("");
    setFormData({
      cardNumber: "",
      endDate: "",
      cvv: "",
      cardholderName: "",
      accountHolderType: "Individual",
      accountType: "Checking",
      fullLegalName: "",
      country: "USA",
      address: "",
      zipCode: "",
      email: "",
      phoneNumber: "",
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && paymentType) {
      setCurrentStep(2);
    }
  };

  const handleAdd = () => {
    // Validate card fields
    if (paymentType === "card") {
      if (!validateCardNumber(formData.cardNumber)) {
        addToast("Invalid card number. Must be 16 digits.", "error");
        return;
      }
      if (!validateEndDate(formData.endDate)) {
        addToast("Invalid end date. Use MM/YY format and ensure card is not expired.", "error");
        return;
      }
      if (!formData.cardholderName.trim()) {
        addToast("Cardholder name is required.", "error");
        return;
      }
    }

    // Validate bank fields
    if (paymentType === "bank") {
      if (!formData.fullLegalName.trim()) {
        addToast("Full legal name is required.", "error");
        return;
      }
      if (!validateEmail(formData.email)) {
        addToast("Invalid email address.", "error");
        return;
      }
      if (!validatePhoneNumber(formData.phoneNumber)) {
        addToast("Invalid phone number. Must be at least 10 digits.", "error");
        return;
      }
    }

    // Submit if valid
    addPaymentMutation.mutate({ type: paymentType, formData });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field, value) => {
    // Apply formatting
    if (field === "cardNumber") {
      value = formatCardNumber(value);
    } else if (field === "endDate") {
      value = formatEndDate(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          onClick={openPaymentModal}
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

      {/* Add Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end p-4">
          <div className="bg-white w-full max-w-md h-full flex flex-col rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Add payment method
                </h3>
                <button
                  onClick={closePaymentModal}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                You can add a new card or bank account to use for payments.
              </p>
            </div>

            {/* Step Indicator */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                {currentStep === 1 ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
                      <span className="text-sm font-medium">1. Type</span>
                      <ChevronRight className="w-4 h-4" />
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
                      <Check className="w-4 h-4 text-green-600" />
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg">
                      <span className="text-sm font-medium">
                        2. {paymentType === "card" ? "Card information" : "Bank account information"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment type
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please select the payment method you would like to add.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentType"
                        value="card"
                        checked={paymentType === "card"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Payment Card
                        </div>
                        <div className="text-sm text-gray-600">
                          Visa, MasterCard or any other card that is allegeable for the USA payments.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentType"
                        value="bank"
                        checked={paymentType === "bank"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Bank account
                        </div>
                        <div className="text-sm text-gray-600">
                          An account held at a bank or other financial institution.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && paymentType === "card" && (
                <div className="space-y-4">
                  {/* Card Details */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("cardDetails")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">Card details</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.cardDetails ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.cardDetails && (
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Card number
                          </label>
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                              End Date
                            </label>
                            <Input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={formData.endDate}
                              onChange={(e) => handleInputChange("endDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                              Security code (CVV)
                            </label>
                            <Input
                              type="text"
                              placeholder="***"
                              maxLength={3}
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("cardholderName")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">Cardholder name</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.cardholderName ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.cardholderName && (
                      <div className="px-4 pb-4">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          First and Last Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Scott Miller"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Billing Address */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("billingAddress")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">Billing address</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.billingAddress ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.billingAddress && (
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Country
                          </label>
                          <Input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Address
                          </label>
                          <Input
                            type="text"
                            placeholder="453 Awesome Lane, New York, NY 10001"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            ZIP code (optional)
                          </label>
                          <Input
                            type="text"
                            placeholder="10001"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && paymentType === "bank" && (
                <div className="space-y-4">
                  {/* Account Holder Information */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("accountHolder")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">
                        Account Holder Information
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.accountHolder ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.accountHolder && (
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Account holder type
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.accountHolderType}
                            onChange={(e) => handleInputChange("accountHolderType", e.target.value)}
                          >
                            <option value="Individual">Individual</option>
                            <option value="Business">Business</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Account type
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.accountType}
                            onChange={(e) => handleInputChange("accountType", e.target.value)}
                          >
                            <option value="Checking">Checking</option>
                            <option value="Savings">Savings</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Full legal name
                          </label>
                          <Input
                            type="text"
                            placeholder="Scott Milli Miller"
                            value={formData.fullLegalName}
                            onChange={(e) => handleInputChange("fullLegalName", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Billing Address for Bank */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("billingAddress")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">Billing address</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.billingAddress ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.billingAddress && (
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Country
                          </label>
                          <Input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Address
                          </label>
                          <Input
                            type="text"
                            placeholder="453 Awesome Lane, New York, NY 10001"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Postcode (optional)
                          </label>
                          <Input
                            type="text"
                            placeholder="10001"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection("contactInfo")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900">Contact information</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSections.contactInfo ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.contactInfo && (
                      <div className="px-4 pb-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            E-mail
                          </label>
                          <Input
                            type="email"
                            placeholder="Scott.miller@gmail.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            placeholder="+1 0 000 0000 00 00"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 sticky bottom-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={closePaymentModal}
                >
                  Cancel
                </Button>
                {currentStep === 1 ? (
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={handleNext}
                    disabled={!paymentType}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
