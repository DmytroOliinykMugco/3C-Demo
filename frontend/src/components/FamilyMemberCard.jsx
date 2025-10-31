import { Star, Phone, Mail, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FamilyMemberCard = ({ member, onStar, onEditAccesses, onDelete }) => {
  return (
    <Card>
      <CardContent className="p-6">
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
          <button
            onClick={() => onStar(member.id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <Star
              className={cn(
                "w-5 h-5",
                member.isStarred && "fill-yellow-500 text-yellow-500"
              )}
            />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Contact information</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Accesses</p>
          <div className="flex flex-wrap gap-2">
            {member.accesses.map((access, index) => (
              <Badge key={index} variant="default">
                <span className="text-xs">Viewer</span>
                {access.id && (
                  <span className="ml-1 text-xs">{access.label}</span>
                )}
                {!access.id && (
                  <span className="ml-1 text-xs">{access.label}</span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEditAccesses(member.id)}
            className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit accesses</span>
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
