const ConfigLog = require("../deviceConfig.model");
const logger = require("../../../config/logger");

/**
 * Add a new DeviceConfig entry
 * @param {Object} payload - Data object to be inserted
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>} - Returns a response object with status, data, and code
 */
const addConfigLog = async (payload, user) => {
  try {
    if (user.role === 'IRM' || user.role === 'admin') {
      return {
        status: false,
        code: 403,
        message:'Access denied: You cannot add config logs',
      };
    }

    const insertResult = await ConfigLog.create(payload);
    return {
      status: true,
      code: 201,
      message: "Log added!",
      results: insertResult,
    };
  } catch (err) {
    logger.error("Error inserting data into database: ", err.message);
    return {
      status: false,
      code: 500,
      message: "Error inserting data into database.",
      error: err.message,
    };
  }
};

module.exports = addConfigLog;
