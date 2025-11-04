import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, CreditCard, Building2, Plus } from "lucide-react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const AddPaymentToContractModal = ({ isOpen, onClose, contractId }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [existingMethodExpanded, setExistingMethodExpanded] = useState(true);

  // Fetch wallet data to get available payment methods
  const { data: walletResponse } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.getWallet,
    enabled: isOpen,
  });

  const walletData = walletResponse?.data;
  const availableMethods = walletData?.allMethods || [];

  // Assign payment method mutation
  const assignMutation = useMutation({
    mutationFn: (data) => api.assignPaymentMethodToContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["wallet"]);
      addToast("Payment method assigned successfully", "success");
      onClose();
    },
    onError: () => {
      addToast("Failed to assign payment method", "error");
    }
  });

  const handleAssignMethod = (methodId) => {
    assignMutation.mutate({ contractId, methodId });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel} variant="right">
      <DialogHeader onClose={handleCancel}>
        <DialogTitle>Add payment method</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select an existing payment method to use for this contract, or add a new one.
          </p>

          {/* Add existing method */}
          <div>
            <button
              type="button"
              onClick={() => setExistingMethodExpanded(!existingMethodExpanded)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold">Add existing method</h3>
              {existingMethodExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {existingMethodExpanded && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Select a payment method from your saved methods
                </p>
                {availableMethods.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No payment methods available. Add a new payment method first.
                  </p>
                ) : (
                  availableMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          {method.icon === "bank" ? (
                            <Building2 className="w-5 h-5 text-gray-600" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignMethod(method.id)}
                        disabled={assignMutation.isPending}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentToContractModal;
