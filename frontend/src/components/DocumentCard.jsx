import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DocumentIcon = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const DocumentCard = ({
  name,
  size,
  badges = [],
  propertyId,
  onPreview,
  onDownload,
  showTitle = false,
  title,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        {showTitle && title && (
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <DocumentIcon />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{name}</p>
              {propertyId && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Property ID: {propertyId}
                </p>
              )}
              {badges.length > 0 ? (
                <div className="flex items-center gap-2 mt-1">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-2 py-0.5 text-xs font-medium rounded ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                  <p className="text-sm text-gray-500">{size}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">{size}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPreview}>
              Preview
            </Button>
            <button
              onClick={onDownload}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Download document"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
