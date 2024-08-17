const mongoose = require("mongoose");
const DataModel = require("../dataModel");

/**
 * Get all data with pagination, filtering, and sorting
 * @returns {Promise<Object>}
 */
const getUniqueStationId = async (filter, user) => {
  try {
    let filterQuery = { active: true };

    if (filter) {
      if (filter?.district) {
        const regxName = new RegExp(`.*${filter.district}.*`, "i");
        filterQuery = { ...filterQuery, district: { $regex: regxName } };
      }
    }

    if (user.role === "district") {
      filterQuery = { ...filterQuery, district: user.district };
    }

    const stationIds = await DataModel.distinct("stationId", filterQuery);
    return {
      data: stationIds,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getUniqueStationId;
