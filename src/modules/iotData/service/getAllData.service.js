const mongoose = require("mongoose");
const DataModel = require("../dataModel");
const moment = require("moment");
 
/**
* Get all data with pagination, filtering, and sorting
* @param {number} page - Current page number
* @param {number} limit - Number of records per page
* @param {Object} filter - Filtering criteria
* @param {Object} sort - Sorting criteria
* @returns {Promise<Object>}
*/
const getAllData = async (page, limit, filter, sort, user) => {
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
 
      if (filter.fromDate && filter.toDate) {
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
 
      if (filter.searchTerm) {
        const searchRegex = new RegExp(`.*${filter.searchTerm}.*`, "i");
        filterQuery = {
          ...filterQuery,
          $or: [
            { district: { $regex: searchRegex } },
            { placeName: { $regex: searchRegex } },
            { panchayatSamiti: { $regex: searchRegex } },
          ],
        };
      }
    }

    // if (user.role === "district") {
    //   filterQuery = { ...filterQuery, district: user.district };
    // }
 
    const listResult = await DataModel.aggregate([
      { $match: filterQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: length },
    ]);
 
    const totalResults = await DataModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);
 
    return {
      data: listResult,
      totalResults,
      totalPages,
      page: start,
      limit: length,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: error.message, status: false, code: 500 };
  }
};
 
module.exports = getAllData;