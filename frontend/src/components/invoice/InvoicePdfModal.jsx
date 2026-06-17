import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { useThemeContext } from "../theme/ThemeProvider";

const PDFViewer = lazy(() =>
  import("@react-pdf/renderer").then((mod) => ({ default: mod.PDFViewer })),
);

const InvoicePDF = lazy(() => import("@/pages/invoice/InvoicePDF"));

export default function InvoicePDFModal({ onClose, invoiceData }) {
  const { primaryColor } = useThemeContext();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-lg font-semibold">Invoice PDF Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense
            fallback={
              <div className="w-full flex justify-center items-center py-8">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: primaryColor }}
                />
              </div>
            }
          >
            <PDFViewer width="100%" height="100%">
              <InvoicePDF invoiceData={invoiceData} />
            </PDFViewer>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
