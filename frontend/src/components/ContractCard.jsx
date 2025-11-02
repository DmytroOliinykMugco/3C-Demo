import { Share2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ContractCard = ({ contract, onShare, onOpenContract }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {contract.type}
        </h3>

        {/* Top section */}
        <div className="space-y-4 pb-6 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Contract number</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-900 text-sm rounded font-medium">
              {contract.contractNumber}
            </span>
          </div>

          {contract.status && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded font-medium">
                {contract.status}
              </span>
            </div>
          )}

          {contract.policyId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Policy ID</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-900 text-sm rounded font-medium">
                {contract.policyId}
              </span>
            </div>
          )}

          {contract.insuranceCarrier && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Insurance carrier</span>
              <span className="text-sm font-medium text-gray-900">
                {contract.insuranceCarrier}
              </span>
            </div>
          )}
        </div>

        {/* Middle section */}
        <div className="space-y-4 py-6 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Your role</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded font-medium">
              {contract.role}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Beneficiary</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                  {contract.beneficiary.initials}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {contract.beneficiary.name}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded font-medium">
                {contract.beneficiary.badge}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Shared with</span>
            <div className="flex items-center -space-x-2">
              {[...Array(contract.sharedWith)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center"
                >
                  <span className="text-xs font-semibold text-purple-700">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="space-y-4 py-6 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total contract amount</span>
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(contract.totalAmount)}
            </span>
          </div>

          {contract.balanceDue !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total balance due</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(contract.balanceDue)}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex h-[60px]">
          <button
            onClick={() => onShare(contract)}
            className="flex-1 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            <span className="font-medium">Share</span>
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={() => onOpenContract(contract)}
            className="flex-1 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            <span className="font-medium">Open contract</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractCard;
