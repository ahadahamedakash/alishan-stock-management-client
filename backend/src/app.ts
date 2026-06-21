import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import router from "./app/routes";
import logger from "./app/config/logger";
import { requestId } from "./app/middlewares/requestId";
import { errorHandler } from "./app/middlewares/errorHandler";
import { requestLogger } from "./app/middlewares/requestLogger";

const app: Application = express();

// Request ID middleware (must be first)
app.use(requestId);

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://alishan-stock-management-f8grkqm9m-ahad-ahameds-projects.vercel.app",
      "https://alishan-stock-management.vercel.app",
    ],
    credentials: true,
  }),
);

// Request logging middleware
app.use(requestLogger);

// Application routes
app.use("/api/v1", router);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
