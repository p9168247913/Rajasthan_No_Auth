const logger = require("../config/logger");

// Middleware to log HTTP requests and errors
const logRequestMiddleware = (req, res, next) => {
  const { method, url, body } = req; // Capture method, URL, and request body

  const start = Date.now(); // Start time for request duration

  res.on("finish", () => {
    // Calculate request duration
    const duration = Date.now() - start;
    // Set log level based on status code
    const logLevel = res.statusCode >= 400 ? "error" : "info";

    // Prepare log message
    const logMessage = `${method} ${url} ${res.statusCode} - ${duration} ms`;

    // Log the request details
    logger.log({
      level: logLevel,
      message: logMessage,
      // Log additional request information in case of error
      ...(logLevel === "error" && {
        error: {
          body: body, // Convert body to JSON string
          headers: {
            host: req.headers.host,
            userAgent: req.headers["user-agent"]
          },
          message: res.locals.errorMessage || "An error occurred",
          stack: res.locals.errorStack || ""
        }
      }),
      // Optionally include request body if necessary (careful with sensitive data)
      ...(logLevel === "info" && {
        request: {
          body: JSON.stringify(body), // Convert body to JSON string
          headers: {
            host: req.headers.host,
            userAgent: req.headers["user-agent"]
          }
        }
      })
    });
  });

  next(); // Pass control to the next middleware
};

module.exports = logRequestMiddleware;
