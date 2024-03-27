import * as winston from "winston";
import { createLogger, transports } from "winston";

const options = {
  file: {
    level: "error",
    filename: "error.txt",
    dirname: "./src/logs",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD",
      }),
      winston.format.json()
    ),
    handleExceptions: true,
    handleRejections: true,
  },

  console: {
    level: "debug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    handleExceptions: true,
  },
};

const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

export default logger;
