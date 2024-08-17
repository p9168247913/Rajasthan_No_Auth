const DeviceConfig = require("../deviceConfig.model");

/**
 * Get all DeviceConfig data with pagination, filtering, and sorting
 * @param {number} page - Current page number
 * @param {number} limit - Number of records per page
 * @param {Object} filter - Filtering criteria
 * @param {Object} sort - Sorting criteria
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>}
 */
const getAllDeviceConfig = async (page, limit, filter, sort, user, flag) => {
  try {
    // Define pagination variables
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 100;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    // Define query filters
    let filterQuery = { active: true };
    let sortQuery = { createdAt: -1 };

    // Construct sorting query
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
    console.log(flag);

    // Construct filtering query
    // if (flag) {
    //   const regxName = new RegExp(`.*${flag}.*`, "i");
    //   filterQuery = { ...filterQuery, flag: { $regex: regxName } };
    // }
    console.log(filterQuery);

    const listResult = await DeviceConfig.aggregate([
      { $match: filterQuery },
      // { $sort: sortQuery },
      
    ]);
    console.log("*******",listResult);

    const totalResults = await DeviceConfig.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);

    return {
      data: listResult,
      // totalResults,
      // totalPages,
      // page: start,
      // limit: length,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getAllDeviceConfig;
