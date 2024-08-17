// cronJob.js
const cron = require("node-cron");
const DataModel = require("./dataModel");
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");
const logger = require("../../config/logger");

// Schedule a cron job to run every day at 2 AM (assuming data is collected by 1 AM)
// Adjust the time according to your needs
cron.schedule("0 2 * * *", async () => {
  try {
    // Get the current date in the format you want for the CSV file
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyyMMdd");

    // Query database for records with isFileCreated set to false
    const records = await DataModel.find({ isFileCreated: false });

    // If no new records, exit the task
    if (records.length === 0) {
      logger.info("No new records found for CSV generation.");
      return;
    }

    // Generate CSV content
    const csvData = records
      .map((record) => {
        return `${record.stationId},${record.latitude},${record.longitude},${record.placeName},${record.panchayatSamiti},${record.district},${record.dateTime},${record.mobileNumber},${record.batteryVoltage},${record.waterTemperature},${record.correctedWaterLevel},${record.rawWaterLevel},${record.atmosphericPressure}`;
      })
      .join("\n");

    // Define the CSV file path
    const csvFileName = `data_${formattedDate}.csv`;
    const csvFolderPath = path.resolve(__dirname, "../../../../csvFiles"); // Navigate outside the backend folder
    const csvFilePath = path.join(csvFolderPath, csvFileName);

    // Ensure the directory exists
    if (!fs.existsSync(csvFolderPath)) {
      fs.mkdirSync(csvFolderPath);
    }

    // Write CSV file
    fs.writeFileSync(csvFilePath, csvData);
    logger.info(`CSV file created: ${csvFileName}`);

    // Update records to set isFileCreated to true
    await DataModel.updateMany(
      { isFileCreated: false },
      { $set: { isFileCreated: true } }
    );

    logger.info("Database records updated successfully.");
  } catch (error) {
    logger.info("Error generating CSV file:", error);
  }
});
