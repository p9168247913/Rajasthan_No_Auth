const mongoose = require("mongoose");
const DeviceConfig = require("../deviceConfig.model");

/**
 * Update a DeviceConfig entry
 * @param {Object} deviceData - Data to update the entry with
 * @param {string} id - ID of the entry to update
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>}
 */
const updateDeviceConfig = async (deviceData, id, user) => {
  try {
    // // Check if the ID is valid
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return {
    //     status: false,
    //     code: 400,
    //     message: "Invalid ID format",
    //     data: null,
    //   };
    // }

    // Restriction for Device users
    if (user.role === 'device') {
      return {
        status: false,
        code: 403,
        message: "Access denied: Device users cannot update configurations.",
      };
    }

    console.log(deviceData.flag, id, user.role)

    if (user.role === 'IRM' && deviceData.flag === 'general') {
      return {
        status: false,
        code: 403,
        message: "Access denied: IRM users cannot update flag to 'general'.",
      };
    }

    const updateResult = await DeviceConfig.findOneAndUpdate(
      { active: true, _id: new mongoose.Types.ObjectId(id) },
      { ...deviceData },
      { new: true }
    );

    // Handle update success or failure
    if (updateResult) {
      return {
        status: true,
        code: 200,
        message: "Device configuration updated successfully.",
        data: updateResult,
      };
    } else {
      return {
        status: false,
        code: 404,
        message: "Device configuration not found or already inactive.",
        data: null,
      };
    }
  } catch (error) {
    // General error handling
    console.error("Error updating device configuration:", error);
    return {
      status: false,
      code: 500,
      message: "Internal server error",
      data: error.message,
    };
  }
};

module.exports = updateDeviceConfig;
