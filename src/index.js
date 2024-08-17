const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const cron = require("node-cron");
const migrateData = require("./migrateData");

let server;
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(async () => {
    logger.info("Connected to MongoDB");
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });

    // cron.schedule("0 14 * * *", async () => {
    //   logger.info("Running scheduled data migration...");
    //   await migrateData();
    // });
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
