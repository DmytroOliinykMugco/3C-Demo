import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ContactCard = ({ contact, onEmailClick, onPhoneClick }) => {
  return (
    <Card className="h-[280px] flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="relative flex-1">
          {/* Role Badge - Top Right */}
          <div className="absolute top-0 right-0">
            <span className="px-3 py-1 bg-black text-white text-xs rounded font-medium">
              {contact.role}
            </span>
          </div>

          {/* Avatar and Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-gray-600">
                {contact.initials}
              </span>
            </div>
            <div className="flex-1 pr-32">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-600">
                {contact.descriptionPrefix}{" "}
                <span className="font-semibold text-gray-700">
                  {contact.descriptionBold}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex h-[60px] border-t">
          <button
            onClick={onEmailClick}
            className="flex-1 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            <span className="font-medium">Email</span>
          </button>
          {contact.phone && (
            <>
              <div className="w-px bg-gray-200" />
              <button
                onClick={onPhoneClick}
                className="flex-1 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="font-medium">{contact.phone}</span>
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
