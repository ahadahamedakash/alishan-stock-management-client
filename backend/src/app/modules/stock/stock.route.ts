import express from "express";

import { USER_ROLE } from "../user/user.constant";
import { StockControllers } from "./stock.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { StockValidation } from "../../validation/stock.validation";
import { auditLogger } from "../../middlewares/auditLogger";

import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// ADD STOCK (STATUS: IN)
router.post(
  "/add-stock",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.stock_manager
  ),
  auditLogger('STOCK_ADD', 'Stock'),
  validateRequest(StockValidation.addStockZodSchema),
  StockControllers.addStock
);

// DEDUCT STOCK BASED ON INVOICE (STATUS: OUT)
router.post(
  "/deduct-stock",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.stock_manager
  ),
  auditLogger('STOCK_DEDUCT', 'Stock'),
  validateRequest(StockValidation.deductStockZodSchema),
  StockControllers.deductStockByInvoice
);

// GET FULL STOCK HISTORY
router.get(
  "/stock-history",
  authMiddleware(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.stock_manager
  ),
  StockControllers.getStockHistory
);

export const StockRoutes = router;
