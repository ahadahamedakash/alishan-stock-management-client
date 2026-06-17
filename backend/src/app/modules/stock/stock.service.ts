import mongoose, { Types } from "mongoose";

import { parseDate } from "../../utils/parseDate";

import { Stock } from "./stock.model";
import { IStock } from "./stock.interface";
import { Invoice } from "../invoice/invoice.model";
import { Product } from "../product/product.model";
import {
  emitToRoles,
  emitNotification,
  SERVER_EVENTS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} from "../../socket";
import { getUserName } from "../../socket/helpers";

const addStock = async (
  productId: string,
  quantity: number,
  issuedBy: string
) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  product.stock += quantity;

  await product.save();

  await Stock.create({
    productId: new Types.ObjectId(productId),
    quantity,
    status: "in",
    issuedBy: new Types.ObjectId(issuedBy),
  } as IStock);

  // Emit real-time notification for stock added
  try {
    console.log('🔧 [Stock Service] Preparing socket emit for stock added...');
    const userName = await getUserName(issuedBy);

    const stockData = {
      productId: product._id.toString(),
      productName: product.name,
      productCode: product.sku || 'N/A',
      quantity,
      action: 'added',
      source: 'manual',
      currentStock: product.stock,
      userId: issuedBy,
      userName,
      timestamp: new Date(),
    };

    console.log('📤 [Stock Service] Calling emitToRoles for admin and stock-manager');
    // Emit stock added event to admin and stock manager
    emitToRoles(['admin', 'stock-manager'], SERVER_EVENTS.STOCK_ADDED, stockData);

    // Also emit as notification
    emitNotification(
      ['admin', 'stock-manager'],
      NOTIFICATION_TYPES.STOCK_IN,
      NOTIFICATION_PRIORITY.MEDIUM,
      {
        title: 'Stock Added',
        message: `${quantity} units of ${product.name}`,
        details: stockData,
      }
    );
  } catch (socketError) {
    console.error('❌ [Stock Service] Failed to emit socket event:', socketError);
  }

  return product;
};

const deductStockByInvoice = async (
  invoiceNumber: string,
  issuedBy: string
) => {
  const invoice = await Invoice.findOne({ invoiceNumber }).populate(
    "products.productId"
  );

  if (!invoice) throw new Error("Invoice not found");

  if (invoice.isStockDeducted) throw new Error("Stock already deducted");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userName = await getUserName(issuedBy);
    const customer = await invoice.customerId;

    // Track total quantity and products for the summary event
    let totalQuantity = 0;
    let hasLowStock = false;

    for (const product of invoice.products) {
      const dbProduct = await Product.findById(product.productId._id).session(
        session
      );
      if (!dbProduct) throw new Error("Product not found");

      if (dbProduct.stock < product.quantity) {
        throw new Error(`Insufficient stock for ${dbProduct.name}`);
      }

      const previousStock = dbProduct.stock;
      totalQuantity += product.quantity;

      dbProduct.stock -= product.quantity;
      dbProduct.reserved = Math.max(
        (dbProduct.reserved || 0) - product.quantity,
        0
      );
      await dbProduct.save();

      await Stock.create(
        [
          {
            productId: product.productId._id,
            quantity: product.quantity,
            status: "out",
            issuedBy,
            invoiceId: invoice._id,
          },
        ],
        { session }
      );

      // Emit real-time notification for each product stock deducted
      try {
        const stockData = {
          productId: dbProduct._id.toString(),
          productName: dbProduct.name,
          productCode: dbProduct.sku || 'N/A',
          quantity: product.quantity,
          action: 'deducted',
          source: 'invoice',
          invoiceId: invoice._id.toString(),
          invoiceNumber: invoice.invoiceNumber,
          currentStock: dbProduct.stock,
          previousStock,
          isLowStock: dbProduct.stock < 10, // Low stock threshold (can be made configurable)
          userId: issuedBy,
          userName,
          timestamp: new Date(),
        };

        if (dbProduct.stock < 10) hasLowStock = true;

        // Emit stock deducted event to admin and stock manager
        emitToRoles(['admin', 'stock-manager'], SERVER_EVENTS.STOCK_DEDUCTED, stockData);
      } catch (socketError) {
        console.error('Failed to emit socket event:', socketError);
      }
    }

    invoice.isStockDeducted = true;
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Emit invoice stock deducted event after successful transaction
    try {
      const invoiceStockData = {
        invoiceId: invoice._id.toString(),
        invoiceNumber: invoice.invoiceNumber,
        customerId: customer.toString(),
        customerName: invoice.customerId?.name || 'Unknown',
        totalProducts: invoice.products.length,
        totalQuantity,
        userId: issuedBy,
        userName,
        timestamp: new Date(),
      };

      // Emit invoice stock deducted event to admin, accountant, and stock-manager
      emitToRoles(['admin', 'accountant', 'stock-manager'], SERVER_EVENTS.INVOICE_STOCK_DEDUCTED, invoiceStockData);

      emitNotification(
        ['admin', 'accountant', 'stock-manager'],
        NOTIFICATION_TYPES.STOCK_OUT,
        NOTIFICATION_PRIORITY.MEDIUM,
        {
          title: 'Invoice Stock Deducted',
          message: `Stock deducted for Invoice ${invoice.invoiceNumber}`,
          details: invoiceStockData,
        }
      );

      // Also emit low stock alert if any product is low
      if (hasLowStock) {
        emitToRoles(['admin', 'stock-manager'], SERVER_EVENTS.STOCK_LOW, {
          invoiceNumber: invoice.invoiceNumber,
          message: 'Some products are running low after stock deduction',
          timestamp: new Date(),
        });
      }
    } catch (socketError) {
      console.error('Failed to emit invoice socket event:', socketError);
    }

    return invoice;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getStockHistory = async (queryParams: {
  search?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    const { search, fromDate, toDate } = queryParams;
    const query: any = {};

    // 🔍 Filter by product name (if search provided)
    if (search) {
      const matchingProducts = await Product.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const matchingProductIds = matchingProducts.map((product) => product._id);
      query.productId = { $in: matchingProductIds };
    }

    // 🗓️ Filter by createdAt range
    const parsedFrom = fromDate ? parseDate(fromDate) : null;
    const parsedTo = toDate ? parseDate(toDate) : null;

    if (parsedFrom || parsedTo) {
      query.createdAt = {};
      if (parsedFrom) query.createdAt.$gte = parsedFrom;
      if (parsedTo) query.createdAt.$lte = parsedTo;
    }

    // 📦 Fetch stock history
    const stockRecords = await Stock.find(query)
      .populate("productId", "name")
      .populate("issuedBy", "name")
      .sort({ createdAt: -1 });

    return stockRecords;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to retrieve stock history: " + error.message);
    } else {
      throw new Error("Failed to retrieve stock history: Unknown error");
    }
  }
};

export const StockServices = {
  addStock,
  getStockHistory,
  deductStockByInvoice,
};
