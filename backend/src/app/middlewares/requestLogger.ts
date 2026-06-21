import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to log HTTP requests with timing information
 * Logs method, URL, status code, duration, IP, and user agent
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { method, url, ip, headers } = req;
    const { statusCode } = res;

    // Log request with relevant information
    logger.info("HTTP Request", {
      requestId: req.id,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip: ip || (headers["x-forwarded-for"] as string)?.split(",")[0]?.trim(),
      userAgent: headers["user-agent"],
    });

    // Warn about slow requests (>1000ms)
    if (duration > 1000) {
      logger.warn("Slow Request Detected", {
        requestId: req.id,
        url,
        method,
        duration: `${duration}ms`,
      });
    }

    // Error status codes
    if (statusCode >= 500) {
      logger.error("Server Error Response", {
        requestId: req.id,
        url,
        method,
        statusCode,
      });
    } else if (statusCode >= 400) {
      logger.warn("Client Error Response", {
        requestId: req.id,
        url,
        method,
        statusCode,
      });
    }
  });

  next();
};
