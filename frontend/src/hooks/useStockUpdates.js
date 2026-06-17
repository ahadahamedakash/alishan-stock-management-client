import { useEffect, useCallback } from "react";

/**
 * Custom hook to listen for stock update events and trigger a callback
 * @param {Function} onStockUpdate - Callback function to execute when stock is updated
 * @param {boolean} enabled - Whether to listen for updates (default: true)
 */
export const useStockUpdates = (onStockUpdate, enabled = true) => {
  const handleStockUpdate = useCallback(
    (event) => {
      console.log("📢 [useStockUpdates] Stock update event received:", event.detail);
      if (enabled && onStockUpdate) {
        onStockUpdate(event.detail);
      }
    },
    [onStockUpdate, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("stock:updated", handleStockUpdate);

    return () => {
      window.removeEventListener("stock:updated", handleStockUpdate);
    };
  }, [handleStockUpdate, enabled]);
};

/**
 * Custom hook to listen for product update events and trigger a callback
 * @param {Function} onProductUpdate - Callback function to execute when product is updated
 * @param {boolean} enabled - Whether to listen for updates (default: true)
 */
export const useProductUpdates = (onProductUpdate, enabled = true) => {
  const handleProductUpdate = useCallback(
    (event) => {
      console.log("📢 [useProductUpdates] Product update event received:", event.detail);
      if (enabled && onProductUpdate) {
        onProductUpdate(event.detail);
      }
    },
    [onProductUpdate, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("product:updated", handleProductUpdate);

    return () => {
      window.removeEventListener("product:updated", handleProductUpdate);
    };
  }, [handleProductUpdate, enabled]);
};

/**
 * Custom hook to listen for invoice stock deducted events and trigger a callback
 * @param {Function} onInvoiceStockDeducted - Callback function to execute when invoice stock is deducted
 * @param {boolean} enabled - Whether to listen for updates (default: true)
 */
export const useInvoiceStockUpdates = (onInvoiceStockDeducted, enabled = true) => {
  const handleInvoiceStockDeducted = useCallback(
    (event) => {
      console.log("📢 [useInvoiceStockUpdates] Invoice stock deducted event received:", event.detail);
      if (enabled && onInvoiceStockDeducted) {
        onInvoiceStockDeducted(event.detail);
      }
    },
    [onInvoiceStockDeducted, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("invoice:stock_deducted", handleInvoiceStockDeducted);

    return () => {
      window.removeEventListener("invoice:stock_deducted", handleInvoiceStockDeducted);
    };
  }, [handleInvoiceStockDeducted, enabled]);
};

/**
 * Custom hook to listen for customer update events and trigger a callback
 * @param {Function} onCustomerUpdate - Callback function to execute when customer is updated
 * @param {boolean} enabled - Whether to listen for updates (default: true)
 */
export const useCustomerUpdates = (onCustomerUpdate, enabled = true) => {
  const handleCustomerUpdate = useCallback(
    (event) => {
      console.log("📢 [useCustomerUpdates] Customer update event received:", event.detail);
      if (enabled && onCustomerUpdate) {
        onCustomerUpdate(event.detail);
      }
    },
    [onCustomerUpdate, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("customer:updated", handleCustomerUpdate);

    return () => {
      window.removeEventListener("customer:updated", handleCustomerUpdate);
    };
  }, [handleCustomerUpdate, enabled]);
};

export default useStockUpdates;
