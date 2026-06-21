import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
const errorDir = path.join(logsDir, "error");
const combinedDir = path.join(logsDir, "combined");
const httpDir = path.join(logsDir, "http");

[logsDir, errorDir, combinedDir, httpDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Log levels: error < warn < info < http < verbose < debug < silly
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors for console output
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(logColors);

// Determine log level from environment
const level = (): string => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      // Filter out internal winston properties
      const cleanMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([key]) => !key.startsWith("Symbol(")),
      );
      if (Object.keys(cleanMetadata).length > 0) {
        msg += ` ${JSON.stringify(cleanMetadata)}`;
      }
    }
    return msg;
  }),
);

// Daily rotating file transports
const transports: winston.transport[] = [
  // Error logs - separate file
  new DailyRotateFile({
    filename: path.join(errorDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
  }),

  // Combined logs - all levels
  new DailyRotateFile({
    filename: path.join(combinedDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),

  // HTTP request logs - separate file
  new DailyRotateFile({
    filename: path.join(httpDir, "http-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "7d",
    level: "http",
  }),
];

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  );
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels: logLevels,
  format,
  transports,
  exitOnError: false, // Don't exit on handled exceptions
});

// Stream for Morgan HTTP logging
// Using Object.defineProperty to add custom stream property for Morgan
Object.defineProperty(logger, "stream", {
  value: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});

export default logger;
