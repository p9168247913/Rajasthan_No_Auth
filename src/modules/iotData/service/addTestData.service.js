const DataTestModel = require("../dataTestModel");
const logger = require("../../../config/logger");

/**
 * Process and insert JSON payload data while avoiding duplicates
 * @param {Array<Object>} payload - Array of data objects to be inserted
 * @returns {Promise<Object>} - Returns a response object with status, data, and code
 */
const addTestData = async (payload) => {
  try {
    const uniqueKeys = payload.map(data => ({
      stationId: data.stationId,
      dateTime: data.dateTime
    }));

    const existingEntries = await DataModel.find({
      $or: uniqueKeys.map(key => ({
        stationId: key.stationId,
        dateTime: key.dateTime
      }))
    });

    const existingKeys = new Set(existingEntries.map(entry => `${entry.stationId}_${entry.dateTime}`));

    const uniqueData = payload.filter(data => {
      const key = `${data.stationId}_${data.dateTime}`;
      return !existingKeys.has(key);
    });

    if (uniqueData.length > 0) {
      const insertResult = await DataTestModel.insertMany(uniqueData);
      return {
        status: true,
        code: 201,
        message: `${insertResult.length} new records added successfully. ${payload.length - uniqueData.length} duplicates skipped.`,
        results: insertResult,
      };
    } else {
      return {
        status: true,
        code: 200,
        message: `All ${payload.length} records were duplicates and have been skipped.`,
      };
    }
  } catch (err) {
    logger.error("Error inserting data into database: ", err.message);
    return {
      status: false,
      code: 500,
      message: 'Error inserting data into database.',
      error: err.message,
    };
  }
};

module.exports = addTestData;