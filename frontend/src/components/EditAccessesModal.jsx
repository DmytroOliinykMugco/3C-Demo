import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Phone, Mail, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';

const EditAccessesModal = ({ isOpen, onClose, member }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [selectedContracts, setSelectedContracts] = useState([]);

  // Fetch contracts
  const { data: contractsResponse } = useQuery({
    queryKey: ['contracts'],
    queryFn: api.getContracts,
    enabled: isOpen,
  });

  const contracts = contractsResponse?.data || [];

  // Initialize selected contracts when member changes
  useEffect(() => {
    if (member && member.accesses) {
      // Extract contract IDs from accesses
      const contractIds = member.accesses
        .filter(access => access.id)
        .map(access => access.id);
      setSelectedContracts(contractIds);
    }
  }, [member]);

  // Update accesses mutation
  const updateAccessesMutation = useMutation({
    mutationFn: ({ memberId, contracts }) => api.updateMemberAccesses(memberId, contracts),
    onSuccess: () => {
      queryClient.invalidateQueries(['family']);
      addToast('Accesses updated successfully', 'success');
      onClose();
    },
  });

  const handleAddContract = (e) => {
    const contractId = e.target.value;
    if (contractId && !selectedContracts.includes(contractId)) {
      setSelectedContracts([...selectedContracts, contractId]);
    }
    // Reset select
    e.target.value = '';
  };

  const handleRemoveContract = (contractId) => {
    setSelectedContracts(selectedContracts.filter(id => id !== contractId));
  };

  const handleSave = () => {
    updateAccessesMutation.mutate({
      memberId: member.id,
      contracts: selectedContracts
    });
  };

  const handleCancel = () => {
    // Reset to original state
    if (member && member.accesses) {
      const contractIds = member.accesses
        .filter(access => access.id)
        .map(access => access.id);
      setSelectedContracts(contractIds);
    }
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel}>
      <DialogHeader onClose={handleCancel}>
        <DialogTitle>Change access</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage contract access for the user
          </p>

          {/* Member Info Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {member.initials}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.relationship}</p>
                </div>
              </div>
              <Star
                className={`w-5 h-5 ${
                  member.isStarred
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </div>

            {/* Contact Information */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Contact information</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share contract */}
          <div>
            <Label htmlFor="contract">Share contract</Label>
            <div className="space-y-3">
              {/* Selected contracts */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-200 rounded-md">
                {selectedContracts.map((contractId) => (
                  <div
                    key={contractId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                  >
                    <span>ID: {contractId}</span>
                    <button
                      onClick={() => handleRemoveContract(contractId)}
                      className="hover:bg-gray-200 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add contract dropdown */}
              <Select
                id="contract"
                onChange={handleAddContract}
                defaultValue=""
              >
                <option value="">Select contract to add</option>
                {contracts
                  .filter(contract => !selectedContracts.includes(contract.contractNumber))
                  .map((contract) => (
                    <option key={contract.id} value={contract.contractNumber}>
                      ID: {contract.contractNumber}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={handleCancel} disabled={updateAccessesMutation.isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={updateAccessesMutation.isPending}>
          {updateAccessesMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditAccessesModal;
