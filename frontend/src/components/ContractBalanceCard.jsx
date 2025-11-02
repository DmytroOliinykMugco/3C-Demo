import { AlertCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContractBalanceCard = ({ contract, onPay, onPayOverdue }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="bg-blue-50 border-0">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {contract.type}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>ID: {contract.contractId}</span>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{contract.owner.name}</span>
              <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-xs rounded">
                {contract.owner.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left section - Total and balances */}
          <div className="col-span-2 space-y-4">
            {/* Total amount */}
            <div className="text-center bg-blue-100 py-4 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(contract.totalAmount)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Total contract amount
              </p>
            </div>

            {/* Pay-off and Balance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    contract.payOffAmount || contract.statementBalanceDue || 0
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {contract.payOffAmount
                    ? "Pay-off amount"
                    : "Total statement balance due"}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(contract.balanceDue || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total contract balance due
                </p>
              </div>
            </div>
          </div>

          {/* Right section - Next payment */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {contract.nextPayment.label}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {contract.nextPayment.dueDate}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {formatCurrency(contract.nextPayment.amount)}
              </p>
              <Button className="w-full mb-3" onClick={onPay}>
                Pay
              </Button>
              <p className="text-sm text-gray-600">
                Number of remaining month
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {contract.remainingMonths}
              </p>
            </div>
          </div>
        </div>

        {/* Overdue payments */}
        {contract.overduePayments && contract.overduePayments.length > 0 && (
          <div className="mt-4 space-y-2">
            {contract.overduePayments.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-red-100 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-900">
                      Your payment for{" "}
                      <span className="font-semibold">{payment.dueDate}</span>{" "}
                      is overdue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={() => onPayOverdue(payment)}
                >
                  Pay now
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractBalanceCard;
