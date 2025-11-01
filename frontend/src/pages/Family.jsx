import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FamilyMemberCard from "@/components/FamilyMemberCard";
import AddUserModal from "@/components/AddUserModal";
import DeleteUserModal from "@/components/DeleteUserModal";
import AddNextOfKinModal from "@/components/AddNextOfKinModal";
import EditAccessesModal from "@/components/EditAccessesModal";
import { useToast } from "@/components/ui/toast";

const Family = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddNextOfKinModal, setShowAddNextOfKinModal] = useState(false);
  const [showEditAccessesModal, setShowEditAccessesModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const {
    data: familyResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["family"],
    queryFn: api.getFamily,
  });

  const familyData = familyResponse?.data;

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: (memberId) => api.toggleFamilyMemberStar(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(["family"]);
      addToast("Star status updated successfully", "success");
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: ({ memberId }) => api.deleteFamilyMember(memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["family"]);

      // Show different message based on whether it was Next of Kin
      if (variables.isNextOfKin) {
        addToast("Next of kin removed successfully", "success");
      } else {
        addToast("Family member deleted successfully", "success");
      }

      setShowDeleteModal(false);
      setMemberToDelete(null);
    },
  });

  const handleStarToggle = (memberId) => {
    toggleStarMutation.mutate(memberId);
  };

  const handleDeleteClick = (member) => {
    // If it's Next of Kin, delete immediately without confirmation
    const isNextOfKin = familyData?.nextOfKin?.id === member.id;

    if (isNextOfKin) {
      deleteMemberMutation.mutate({ memberId: member.id, isNextOfKin: true });
    } else {
      // For other members, show confirmation dialog
      setMemberToDelete(member);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteMemberMutation.mutate({ memberId: memberToDelete.id, isNextOfKin: false });
    }
  };

  const handleEditAccesses = (member) => {
    setMemberToEdit(member);
    setShowEditAccessesModal(true);
  };

  const handleComingSoon = (feature) => {
    addToast(`${feature} will be developed soon`, "success");
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
              Invite family and trusted individuals to manage contract access
              and ensure seamless collaboration.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleComingSoon("Share contract access")}
            >
              Share contract access
            </Button>
            <Button onClick={() => setShowAddUserModal(true)}>
              Add user manually
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-2 ">
        {/* Next of Kin */}
        <div className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Next of Kin
              </h2>
              <p className="text-sm text-gray-600">
                Here you can add, edit, or remove a person you trust to manage
                your account in case of an emergency.
              </p>
            </div>
            {familyData?.nextOfKin ? (
              <div className="max-w-md">
                <FamilyMemberCard
                  member={familyData.nextOfKin}
                  onStar={() => handleStarToggle(familyData.nextOfKin.id)}
                  onEditAccesses={() => handleEditAccesses(familyData.nextOfKin)}
                  onDelete={() => handleDeleteClick(familyData.nextOfKin)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select next of Kin
                </h3>
                <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
                  Adding a next of kin ensures that someone you trust can manage
                  your account if you're unable to.
                </p>
                <Button onClick={() => setShowAddNextOfKinModal(true)}>
                  Add a member
                </Button>
              </div>
            )}
          </CardContent>
        </div>

        {/* Starred Members */}
        <CardContent className="p-6">
          {familyData?.starredMembers &&
            familyData.starredMembers.length > 0 && (
              <div className="mb-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Starred members
                  </h2>
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
                      onEditAccesses={() => handleEditAccesses(member)}
                      onDelete={() => handleDeleteClick(member)}
                    />
                  ))}
                </div>
              </div>
            )}
        </CardContent>

        {/* All Members */}
        <CardContent className="p-6">
          {familyData?.allMembers && familyData.allMembers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                All members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyData.allMembers.map((member) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    onStar={() => handleStarToggle(member.id)}
                    onEditAccesses={() => handleEditAccesses(member)}
                    onDelete={() => handleDeleteClick(member)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMemberToDelete(null);
        }}
        member={memberToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMemberMutation.isPending}
      />

      {/* Add Next of Kin Modal */}
      <AddNextOfKinModal
        isOpen={showAddNextOfKinModal}
        onClose={() => setShowAddNextOfKinModal(false)}
      />

      {/* Edit Accesses Modal */}
      <EditAccessesModal
        isOpen={showEditAccessesModal}
        onClose={() => {
          setShowEditAccessesModal(false);
          setMemberToEdit(null);
        }}
        member={memberToEdit}
      />
    </div>
  );
};

export default Family;
