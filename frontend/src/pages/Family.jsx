import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import FamilyMemberCard from '@/components/FamilyMemberCard';
import AddUserModal from '@/components/AddUserModal';
import { useToast } from '@/components/ui/toast';

const Family = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { data: familyResponse, isLoading, error } = useQuery({
    queryKey: ['family'],
    queryFn: api.getFamily,
  });

  const familyData = familyResponse?.data;

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: (memberId) => api.toggleFamilyMemberStar(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['family']);
      addToast('Star status updated successfully', 'success');
    },
  });

  const handleStarToggle = (memberId) => {
    toggleStarMutation.mutate(memberId);
  };

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, 'success');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading family members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading family: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Family</h1>
            <p className="text-gray-600 max-w-2xl">
              Invite family and trusted individuals to manage contract access and ensure seamless collaboration.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleComingSoon('Share contract access')}
            >
              Share contract access
            </Button>
            <Button onClick={() => setShowAddUserModal(true)}>
              Add user manually
            </Button>
          </div>
        </div>
      </div>

      {/* Next of Kin */}
      {familyData?.nextOfKin && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Next of Kin</h2>
            <p className="text-sm text-gray-600">
              Here you can add, edit, or remove a person you trust to manage your account in case of an emergency.
            </p>
          </div>
          <div className="max-w-md">
            <FamilyMemberCard
              member={familyData.nextOfKin}
              onStar={() => handleStarToggle(familyData.nextOfKin.id)}
              onEditAccesses={() => handleComingSoon('Edit accesses')}
              onDelete={() => handleComingSoon('Delete member')}
            />
          </div>
        </div>
      )}

      {/* Starred Members */}
      {familyData?.starredMembers && familyData.starredMembers.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Starred members</h2>
            <p className="text-sm text-gray-600">
              Starred members will appear at the top of all lists.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.starredMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onStar={() => handleStarToggle(member.id)}
                onEditAccesses={() => handleComingSoon('Edit accesses')}
                onDelete={() => handleComingSoon('Delete member')}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Members */}
      {familyData?.allMembers && familyData.allMembers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.allMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onStar={() => handleStarToggle(member.id)}
                onEditAccesses={() => handleComingSoon('Edit accesses')}
                onDelete={() => handleComingSoon('Delete member')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />
    </div>
  );
};

export default Family;
