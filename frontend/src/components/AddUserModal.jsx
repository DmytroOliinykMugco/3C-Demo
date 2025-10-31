import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

const AddUserModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [contactInfoExpanded, setContactInfoExpanded] = useState(true);
  const [contractExpanded, setContractExpanded] = useState(true);

  // Fetch contracts
  const { data: contractsResponse } = useQuery({
    queryKey: ['contracts'],
    queryFn: api.getContracts,
    enabled: isOpen,
  });

  const contracts = contractsResponse?.data || [];

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: 'Mister',
      firstName: '',
      lastName: '',
      familyStatus: 'Father',
      email: '',
      phone: '',
      contractId: '',
    }
  });

  // Add family member mutation
  const addMemberMutation = useMutation({
    mutationFn: (data) => api.addFamilyMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['family']);
      addToast('Family member added successfully', 'success');
      reset();
      onClose();
    },
  });

  const onSubmit = (data) => {
    addMemberMutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel} variant="right">
      <DialogHeader onClose={handleCancel}>
        <DialogTitle>Add user manually</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Here, you can manually add users. They'll receive an email with login instructions. Note: data can't be changed post-invite. User will be added to your list after they log in.
          </p>

          {/* General Information */}
          <div className="border-b pb-4">
            <button
              type="button"
              onClick={() => setGeneralInfoExpanded(!generalInfoExpanded)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold">General information</h3>
              {generalInfoExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {generalInfoExpanded && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" {...register('status')}>
                    <option value="Mister">Mister</option>
                    <option value="Miss">Miss</option>
                    <option value="Mrs">Mrs</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Input here"
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Miller"
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="familyStatus">Family status</Label>
                  <Select id="familyStatus" {...register('familyStatus')}>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="border-b pb-4">
            <button
              type="button"
              onClick={() => setContactInfoExpanded(!contactInfoExpanded)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold">Contact information</h3>
              {contactInfoExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {contactInfoExpanded && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Scott.miller@gmail.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Number (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+00 000 0000 00 00"
                    {...register('phone')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Add to Contract */}
          <div>
            <button
              type="button"
              onClick={() => setContractExpanded(!contractExpanded)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold">Add to contract</h3>
              {contractExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {contractExpanded && (
              <div>
                <Label htmlFor="contractId">Contract</Label>
                <Select
                  id="contractId"
                  {...register('contractId', { required: 'Please select a contract' })}
                >
                  <option value="">Search contract ID</option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contractNumber}
                    </option>
                  ))}
                </Select>
                {errors.contractId && <p className="text-red-500 text-sm mt-1">{errors.contractId.message}</p>}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={handleCancel} type="button">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={addMemberMutation.isPending}>
          {addMemberMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddUserModal;
