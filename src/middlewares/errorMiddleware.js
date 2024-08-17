const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const logLevel = statusCode >= 400 ? "error" : "info";
console.log(req);

  // Log the error details
  logger.log({
    level: logLevel,
    message: `${statusCode} ${err.message}`,
    error: {
      message: err.message,
      stack: err.stack || "",
    },
    request: {
      body: JSON.stringify(req.body) || "Body not available", // Include request body
      headers: {
        host: req.headers.host,
        userAgent: req.headers["user-agent"],
      },
    },
  });

  // Send error response
  res.status(statusCode).json({
    status: false,
    statusCode,
    message: err.message,
  });
};

module.exports = errorHandler;

