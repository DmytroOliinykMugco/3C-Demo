import { useState } from "react";
import { Mail, Phone, FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const Information = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("signed");

  const handleComingSoon = () => {
    addToast("Coming soon", "success");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:support@3c.com?subject=Customer Support Request";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+16505508808";
  };

  const signedDocuments = [];

  const exampleDocuments = [
    { name: "Example Document 1", size: "1.2mb" },
    { name: "Example Document 2", size: "3.1mb" },
  ];

  const documents = activeTab === "signed" ? signedDocuments : exampleDocuments;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Information at time of need
        </h1>
        <p className="text-gray-600">
          Your profile helps personalize your experience and ensures legal
          compliance. Please provide accurate information.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Emergency contacts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Emergency contacts
            </h2>
            <p className="text-gray-600 mb-4">
              Contacts that can help in an At-need case
            </p>

            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      CS
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        Customer support
                      </h3>
                      <span className="px-2 py-0.5 bg-black text-white text-xs rounded">
                        24/7
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Our customer support is available 24/7.
                      <br />
                      Let us know how we can assist you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleEmailClick}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePhoneClick}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    +1 (650) 550-8808
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome. This website has been prepared to help you...
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>
                Get ready for your arrangement meeting and understand how we can
                support you and your family.
              </li>
              <li>
                Explore different ways to celebrate and honor the life of your
                loved one.
              </li>
              <li>Share service details easily with friends and family.</li>
            </ul>
            <p className="text-gray-600">
              This site is private and secure. Any information you provide will
              be available during your arrangement appointment for review and
              approval.
            </p>
          </div>

          {/* What to Expect */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What to Expect
            </h2>
            <p className="text-gray-700 mb-4">
              When we meet to discuss arrangements, we'll cover several key
              steps, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>
                Sharing memories of your loved one and discussing your ideas,
                traditions, and wishes.
              </li>
              <li>
                Coordinating plans with everyone involved—such as clergy or
                celebrants, musicians, cemetery/crematory staff, florists, and
                newspapers (for obituaries).
              </li>
              <li>
                Reviewing details for the death certificate and assisting you in
                preparing obituaries or other tribute materials.
              </li>
            </ul>
            <p className="text-gray-600">
              Our mission is to guide and support your family through the loss
              process with care and understanding. We'll work closely with you
              to ensure that your choices reflect the emotional, relational, and
              spiritual needs that arise when we lose someone we love.
            </p>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Documents
            </h2>
            <p className="text-gray-700 mb-2">
              Documents you can review and sign to give CL legal rights to
              operate your case in at-need.
            </p>
            <p className="text-gray-600 mb-4">
              If you wish to sign any document:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 mb-6">
              <li>Download the document</li>
              <li>Sign via DocuSign</li>
              <li>Upload signed document</li>
            </ol>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab("signed")}
                className={`pb-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === "signed"
                    ? "border-b-2 border-black text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Signed documents
              </button>
              <button
                onClick={() => setActiveTab("example")}
                className={`pb-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === "example"
                    ? "border-b-2 border-black text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Example
              </button>
            </div>
            {/* Document cards */}
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No documents added
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  You have not signed any documents yet. Drag and drop document
                  here.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Please use{" "}
                  <a
                    href="https://www.docusign.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    DocuSign
                  </a>{" "}
                  to sign the documents.
                </p>
                <Button onClick={handleComingSoon}>
                  Upload signed documents
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.name}
                            </p>
                            <p className="text-sm text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleComingSoon}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleComingSoon}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Information;
