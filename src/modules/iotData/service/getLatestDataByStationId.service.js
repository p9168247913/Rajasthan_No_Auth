const mongoose = require("mongoose");
const DataModel = require("../dataModel");

/**
 * Get all data with pagination, filtering, and sorting
 * @returns {Promise<Object>}
 */
const getLatestDataByStationId = async (page, limit, filter, sort, user) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = { active: true };
    let sortQuery = { dateTime: -1 };
 
    if (sort) {
      for (let key in sort) {
        if (sort.hasOwnProperty(key)) {
          let value = sort[key];
          let numericValue = Number(value);
          if (!isNaN(numericValue)) {
            sortQuery[key] = numericValue;
          }
        }
      }
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

    if (user.role === "district") {
      filterQuery = { ...filterQuery, district: user.district };
    }

    const aggregationPipeline = [
      { $match: filterQuery },
      {
        $addFields: {
          parsedDateTime: {
            $dateFromString: {
              dateString: "$dateTime",
              format: "%d/%m/%Y %H:%M",
            },
          },
        },
      },
      {
        $sort: {
          stationId: 1,
          parsedDateTime: -1,
        },
      },
      {
        $group: {
          _id: "$stationId",
          latestData: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$latestData",
        },
      },
    ];

    const countPipeline = [
      { $match: filterQuery },
      {
        $group: {
          _id: "$stationId",
        },
      },
      {
        $count: "totalUniqueStationIds",
      },
    ];

    const latestDataWithPagination = await DataModel.aggregate([
      ...aggregationPipeline,
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: length },
    ]);

    const countResult = await DataModel.aggregate(countPipeline);
    const totalResults = countResult[0]?.totalUniqueStationIds || 0;
    const totalPages = Math.ceil(totalResults / length);

    return {
      data: latestDataWithPagination,
      status: true,
      code: 200,
      totalResults,
      totalPages,
      page: start,
      limit: length,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getLatestDataByStationId;
