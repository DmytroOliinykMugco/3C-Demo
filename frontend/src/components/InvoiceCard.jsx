import { Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InvoiceCard = ({ invoice, onPay, onPreview, onDownload }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {invoice.fileName}
            </h3>
            <p className="text-sm text-gray-500">{invoice.fileSize}</p>
          </div>
        </div>

        {/* Invoice details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Invoice ID:</span>
            <span className="text-sm font-medium text-gray-900">
              ID: {invoice.invoiceId}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment due</span>
            <span className="text-sm font-medium text-gray-900">
              {invoice.paymentDue}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <span
              className={`px-3 py-1 text-sm rounded font-medium ${
                invoice.status === "Payed"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "Ongoing"
                  ? "bg-blue-100 text-blue-800"
                  : invoice.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(invoice.amount)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {invoice.status === "Ongoing" || invoice.status === "Pending" ? (
            <>
              <Button
                onClick={() => onPay(invoice)}
                className="flex-1"
              >
                Pay
              </Button>
              <button
                onClick={() => onPreview(invoice)}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => onDownload(invoice)}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onPreview(invoice)}
                className="flex-1 p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => onDownload(invoice)}
                className="flex-1 p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
