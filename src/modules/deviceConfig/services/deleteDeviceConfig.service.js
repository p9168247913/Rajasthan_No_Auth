const mongoose = require("mongoose");
const DeviceConfig = require("../deviceConfig.model");

/**
 * Delete a DeviceConfig entry by marking it as inactive
 * @param {string} id - ID of the entry to delete
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>}
 */
const deleteDeviceConfig = async (id, user) => {
  try {
    if (user.role === 'device') {
      return {
        status: false,
        code: 403,
        message: "Access denied: Device users cannot delete configurations.",
      };
    }

    const seriesearchQuery = {
      active: true,
      _id: new mongoose.Types.ObjectId(id),
    };

    const deleteResult = await DeviceConfig.findOneAndUpdate(
      seriesearchQuery,
      { active: false },
      { new: true }
    );

    if (deleteResult) {
      return { data: "Deleted successfully", status: true, code: 200 };
    } else {
      return { data: "Not Found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deleteDeviceConfig;
