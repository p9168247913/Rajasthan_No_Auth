const DataPacket = require("../dataModel"); // Replace with your model path
const moment = require("moment");

/**
 * Get all data from DataPacket model with optional filtering and sorting
 * @param {Object} filter - Optional filtering criteria
 * @param {Object} sort - Optional sorting criteria
 * @returns {Promise<Object>}
 */
const downloadAllData = async (filter, sort, user) => {
  try {
    let filterQuery = { active: true };
    let sortQuery = { dateTime: -1 };

    if (sort) {
      for (let key in sort) {
        if (sort.hasOwnProperty(key)) {
          let value = sort[key];
          let numericValue = Number(value);
          if (!isNaN(numericValue)) {
            sort[key] = numericValue;
          }
        }
      }
      sortQuery = sort;
    }

    if (filter) {
      if (filter.district) {
        const regxName = new RegExp(`.*${filter.district}.*`, "i");
        filterQuery = { ...filterQuery, district: { $regex: regxName } };
      }

      if (filter.placeName) {
        const regxName = new RegExp(`.*${filter.placeName}.*`, "i");
        filterQuery = { ...filterQuery, placeName: { $regex: regxName } };
      }

      if (filter.panchayatSamiti) {
        const regxName = new RegExp(`.*${filter.panchayatSamiti}.*`, "i");
        filterQuery = { ...filterQuery, panchayatSamiti: { $regex: regxName } };
      }

      if (filter.stationId) {
        filterQuery = { ...filterQuery, stationId: filter.stationId };
      }
    }

    if (filter?.fromDate && filter?.toDate) {
      const fromDate = moment(filter.fromDate, "DD/MM/YYYY")
        .startOf("day")
        .format("DD/MM/YY");
      const toDate = moment(filter.toDate, "DD/MM/YYYY")
        .endOf("day")
        .format("DD/MM/YY");

      filterQuery = {
        ...filterQuery,
        $expr: {
          $and: [
            { $gte: [{ $substrCP: ["$dateTime", 0, 8] }, fromDate] },
            { $lte: [{ $substrCP: ["$dateTime", 0, 8] }, toDate] },
          ],
        },
      };
    }

    if (user.role === "district") {
      filterQuery = { ...filterQuery, district: user.district };
    }

    const listResult = await DataPacket.aggregate([
      { $match: filterQuery },
      { $sort: sortQuery },
      {
        $project: {
          _id: 0,
          active: 0,
          // "createdAt":0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    const totalResults = await DataPacket.countDocuments(filterQuery);

    if (listResult) {
      return { data: listResult, totalResults, status: true, code: 200 };
    } else {
      return { data: "Data not found!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = downloadAllData;
