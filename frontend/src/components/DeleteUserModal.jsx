import { Star, Phone, Mail } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DeleteUserModal = ({ isOpen, onClose, member, onConfirm, isDeleting }) => {
  if (!member) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>Delete user</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this user? All their accesses will be terminated
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

            {/* Accesses */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Accesses</h4>
              <div className="flex flex-wrap gap-2">
                {member.accesses?.map((access, index) => (
                  <Badge key={index} variant="secondary">
                    {access.type === 'viewer' && (
                      <span className="text-xs">Viewer</span>
                    )}
                    <span className="ml-1 text-xs">{access.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DeleteUserModal;
