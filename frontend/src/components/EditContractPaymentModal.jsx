import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building2,
  MoreHorizontal,
  X,
  Download
} from "lucide-react";
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

const EditContractPaymentModal = ({ isOpen, onClose, contract }) => {
  const { addToast } = useToast();
  const [selectedContracts, setSelectedContracts] = useState(
    contract ? [contract.contractId] : []
  );
  const [selectMethodExpanded, setSelectMethodExpanded] = useState(true);
  const [signDocumentsExpanded, setSignDocumentsExpanded] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch wallet data to get available payment methods
  const { data: walletResponse } = useQuery({
    queryKey: ["wallet"],
    queryFn: api.getWallet,
    enabled: isOpen,
  });

  // Fetch contracts data
  const { data: contractsResponse } = useQuery({
    queryKey: ["contracts"],
    queryFn: api.getContracts,
    enabled: isOpen,
  });

  const walletData = walletResponse?.data;
  const allContracts = contractsResponse?.data || [];
  const paymentMethod = contract?.paymentMethod;

  // Get available contracts (not already selected)
  const availableContracts = allContracts.filter(
    c => !selectedContracts.includes(c.contractNumber)
  );

  const handleRemoveContract = (contractId) => {
    setSelectedContracts(selectedContracts.filter(id => id !== contractId));
  };

  const handleAddContract = (contractNumber) => {
    if (contractNumber && !selectedContracts.includes(contractNumber)) {
      setSelectedContracts([...selectedContracts, contractNumber]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)}kb`,
        file: file,
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const handleSendEdits = () => {
    addToast("Edits sent to the counselor successfully", "success");
    onClose();
  };

  const handlePreviewDocument = (doc) => {
    window.open(`http://localhost:3000/example-pdfs/${doc.fileName}`, '_blank');
  };

  const handleDownloadDocument = (doc) => {
    const url = `http://localhost:3000/example-pdfs/${doc.fileName}`;
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      });
  };

  // Get legal documents from wallet data
  const legalDocuments = walletData?.legalDocuments || [];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit payment method</DialogTitle>
        <p className="text-sm text-gray-600 mt-2">
          Enter the email addresses of the people you want to share the contract with.
        </p>
      </DialogHeader>

        <DialogContent>
          <div className="space-y-6">
            {/* Select contract */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Select contract
              </h3>
              <div className="border border-gray-300 rounded-lg p-3 relative">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedContracts.map((contractId) => (
                    <div
                      key={contractId}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg"
                    >
                      <span className="text-sm">ID: {contractId}</span>
                      <button
                        onClick={() => handleRemoveContract(contractId)}
                        className="hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
                {availableContracts.length > 0 && (
                  <>
                    <select
                      className="w-full px-3 py-2 pr-10 border-0 text-sm text-gray-500 focus:outline-none appearance-none cursor-pointer"
                      onChange={(e) => {
                        handleAddContract(e.target.value);
                        e.target.value = "";
                      }}
                      value=""
                    >
                      <option value="">Add contract...</option>
                      {availableContracts.map((contract) => (
                        <option key={contract.id} value={contract.contractNumber}>
                          ID: {contract.contractNumber}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-6 bottom-5 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

          {/* Select method */}
          <div>
            <button
              type="button"
              onClick={() => setSelectMethodExpanded(!selectMethodExpanded)}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="text-base font-semibold text-gray-900">Select method</h3>
              {selectMethodExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {selectMethodExpanded && paymentMethod && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {paymentMethod.icon === "bank" ? (
                        <Building2 className="w-6 h-6 text-gray-600" />
                      ) : (
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{paymentMethod.type}</p>
                      <p className="text-base font-semibold text-gray-900">
                        {paymentMethod.holderName}
                      </p>
                      <p className="text-sm text-gray-600">**** {paymentMethod.lastDigits}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign documents */}
          <div>
            <button
              type="button"
              onClick={() => setSignDocumentsExpanded(!signDocumentsExpanded)}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="text-base font-semibold text-gray-900">Sign documents</h3>
              {signDocumentsExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {signDocumentsExpanded && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  To complete the process, please review and sign the documents below so we'll be able to proceed with automatic payments
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>Download the document</li>
                  <li>
                    Sign via{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      DocuSign
                    </a>
                  </li>
                  <li>Upload signed document</li>
                </ol>

                {/* Document list */}
                <div className="space-y-3">
                  {legalDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
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
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewDocument(doc)}
                        >
                          Preview
                        </Button>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Signed document upload */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Signed document</h4>

                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3 mb-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
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
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File upload button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id="signed-document"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf"
                      multiple
                    />
                    <label
                      htmlFor="signed-document"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose file</span>
                      </Button>
                      <span className="text-sm text-gray-600">
                        No file chosen
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={handleSendEdits}
        >
          Send edits to the counselor
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditContractPaymentModal;
