const DeviceConfig = require("../deviceConfig.model");
const logger = require("../../../config/logger");

/**
 * Add a new DeviceConfig entry
 * @param {Object} payload - Data object to be inserted
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>} - Returns a response object with status, data, and code
 */
const addDeviceConfig = async (payload, user) => {
  try {
    // Check user role permissions
    if (user.role === 'device') {
      return {
        status: false,
        code: 403,
        message: "Access denied: Device users cannot add configurations.",
      };
    }

    if (user.role === 'IRM' && payload.flag === 'general') {
      return {
        status: false,
        code: 403,
        message: "Access denied: IRM users cannot add flag='general'.",
      };
    }

    const existingConfig = await DeviceConfig.findOne({ flag: payload.flag });

    if (existingConfig) {
      existingConfig.payload = payload.payload;
      await existingConfig.save();

      return {
        status: true,
        code: 200,
        message: "Data updated!",
        results: existingConfig,
      };
    }

    const insertResult = await DeviceConfig.create(payload);
    return {
      status: true,
      code: 201,
      message: "Data added!",
      // results: insertResult,
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

module.exports = addDeviceConfig;
