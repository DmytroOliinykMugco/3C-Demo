import { MapPin, MoreVertical, Share2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PropertyCard = ({ property, onMenuClick, menuOpen, onOpenPropertyPage, onShare }) => {
  return (
    <Card className="overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.type}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded text-xs font-medium">
          Contact ID: {property.contractId}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {property.type}
          </h3>
          <div className="flex items-center gap-2 relative property-menu-container">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
              {property.status}
            </span>
            <button
              onClick={() => onMenuClick(property)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
                <button
                  onClick={() => onOpenPropertyPage(property)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Property page
                </button>
                <button
                  onClick={() => onShare(property)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-xs font-semibold text-purple-700">
              {property.owner.initials}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {property.owner.name}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded">
            {property.owner.badge}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
