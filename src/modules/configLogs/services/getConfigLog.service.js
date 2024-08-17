const ConfigLog = require("../deviceConfig.model");

/**
 * Get all DeviceConfig data with pagination, filtering, and sorting
 * @param {number} page - Current page number
 * @param {number} limit - Number of records per page
 * @param {Object} filter - Filtering criteria
 * @param {Object} sort - Sorting criteria
 * @param {Object} user - The user object containing role information
 * @returns {Promise<Object>}
 */
const getAllConfigLog = async (page, limit, filter, sort, user, flag) => {
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

    // Construct filtering query
      if (flag) {
        const regxName = new RegExp(`.*${flag}.*`, "i");
        filterQuery = { ...filterQuery, flag: { $regex: regxName } };
      }

    const listResult = await ConfigLog.aggregate([
      { $match: filterQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: length },
      {
        $project: {
            '_id': 0,
            'flag': 0,
            'active': 0,
            'createdAt': 0,
            'updatedAt': 0,
            'seqId':0
        }
    },
    ]);

    const totalResults = await ConfigLog.countDocuments(filterQuery);
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

module.exports = getAllConfigLog;
