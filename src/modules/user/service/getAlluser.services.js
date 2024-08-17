const mongoose = require("mongoose");
const User = require("../user.model");

/**
 * Get all users with pagination, filtering, and sorting
 * @param {String} userRole - Role of the logged-in user
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of users per page
 * @param {Object} filter - Filter criteria
 * @param {Object} sort - Sorting criteria
 * @returns {Promise<Object>}
 */
const getAllUsers = async (page, limit, filter, sort, userRole) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = { active: true };

    if (userRole === "super-admin") {
      filterQuery.role = { $in: ["admin", "district"] };
    } else if (userRole === "admin") {
      filterQuery.role = "district";
    } else {
      throw new Error("Unauthorized");
    }

    let sortQuery = { _id: -1 };

    for (let key in sort) {
      if (sort.hasOwnProperty(key)) {
        let value = sort[key];
        let numericValue = Number(value);
        if (!isNaN(numericValue)) {
          sort[key] = numericValue;
        }
      }
    }

    if (sort) {
      sortQuery = sort;
    }

    if (filter?.role) {
      filterQuery = { ...filterQuery, role: filter.role };
    }
    if (filter?.name) {
      const regxName = new RegExp(`.*${filter.name}.*`, "i");
      filterQuery = { ...filterQuery, name: { $regex: regxName } };
    }
    if (filter?.district) {
      const regxDistrict = new RegExp(`.*${filter.district}.*`, "i");
      filterQuery = { ...filterQuery, district: { $regex: regxDistrict } };
    }

    const listResult = await User.aggregate([
      { $match: filterQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: length },
      { $project: { password: 0 } },
    ]);

    const totalResults = await User.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);

    if (listResult) {
      return {
        data: listResult,
        totalResults,
        totalPages,
        page: start,
        limit: length,
        status: true,
        code: 200,
      };
    } else {
      return { data: "User not found!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getAllUsers;
