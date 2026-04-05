import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Eye, Download, CircleDashed, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import InvoicePDF from "@/pages/invoice/InvoicePDF";

const InvoiceActionButtons = ({ invoiceData, onViewInvoice }) => {
  return (
    <div className="flex gap-3 justify-end">
      <Button variant="outline" onClick={onViewInvoice.onTrue}>
        <Eye className="h-4 w-4" />
      </Button>
      <PDFDownloadLink
        document={<InvoicePDF invoiceData={invoiceData} />}
        fileName={`invoice-${invoiceData.invoiceNo}.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <Button variant="outline" disabled>
              <CircleDashed className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          )
        }
      </PDFDownloadLink>

      {/* PDF Viewer Modal */}
      {onViewInvoice.value && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center border-b p-3">
              <h3 className="text-lg font-semibold">Invoice PDF Preview</h3>
              <button
                onClick={onViewInvoice.onFalse}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close PDF viewer"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <PDFViewer width="100%" height="100%">
                <InvoicePDF invoiceData={invoiceData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceActionButtons;
