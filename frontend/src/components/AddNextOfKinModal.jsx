import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Star, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const AddNextOfKinModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [existingMemberExpanded, setExistingMemberExpanded] = useState(true);

  // Fetch family members
  const { data: familyResponse } = useQuery({
    queryKey: ["family"],
    queryFn: api.getFamily,
    enabled: isOpen,
  });

  const familyData = familyResponse?.data;
  const allMembers = [
    ...(familyData?.starredMembers || []),
    ...(familyData?.allMembers || []),
  ];

  // Assign next of kin mutation
  const assignMutation = useMutation({
    mutationFn: (data) => api.assignNextOfKin(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["family"]);
      addToast("Next of kin assigned successfully", "success");
      onClose();
    },
  });

  const handleAssignMember = (memberId) => {
    assignMutation.mutate({ memberId });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel} variant="right">
      <DialogHeader onClose={handleCancel}>
        <DialogTitle>Add next of Kin</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Nominate a trusted individual to manage your account or invite an
            existing member.
          </p>

          {/* Add existing member */}
          <div>
            <button
              type="button"
              onClick={() => setExistingMemberExpanded(!existingMemberExpanded)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold">Add existing member</h3>
              {existingMemberExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {existingMemberExpanded && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Assign that role to someone who's already in the system
                </p>
                {allMembers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No family members available
                  </p>
                ) : (
                  allMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {member.initials}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {member.name}
                            </p>
                            {member.isStarred && (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {member.relationship}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignMember(member.id)}
                        disabled={assignMutation.isPending}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
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

export default AddNextOfKinModal;
