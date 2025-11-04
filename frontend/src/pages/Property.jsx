import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowLeft, Share2 } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const Property = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    data: balanceResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: api.getBalance,
  });

  const property = balanceResponse?.data?.ownedProperty.find(
    (p) => p.id === parseInt(id)
  );

  const handleShare = () => {
    addToast("Share functionality coming soon", "success");
  };

  const handleBack = () => {
    navigate("/balance");
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Balance
      </button>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.type}
          </h1>
          <p className="text-gray-600">Property Details</p>
        </div>
        <Button onClick={handleShare} variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Image */}
        <Card>
          <CardContent className="p-0">
            <img
              src={property.image}
              alt={property.type}
              className="w-full h-96 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Information
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contract ID
                  </label>
                  <p className="text-gray-900">{property.contractId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Type
                  </label>
                  <p className="text-gray-900">{property.type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                      {property.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Location
                  </label>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{property.location}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Purchase Year
                  </label>
                  <p className="text-gray-900">{property.purchaseYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Owner Information
              </h2>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-purple-700">
                    {property.owner.initials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {property.owner.name}
                  </p>
                  <span className="px-2 py-0.5 bg-red-100 text-red-900 text-xs rounded">
                    {property.owner.badge}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Property;
