import { FileText, Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StatementCard = ({ statement, onPreview, onDownload }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {statement.name}
            </p>
            <p className="text-sm text-gray-500">ID: {statement.id}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <span>{statement.date}</span>
              <span>{statement.size}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(statement)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(statement)}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatementCard;
