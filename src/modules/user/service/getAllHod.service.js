const mongoose = require("mongoose");
const User = require("../user.model");
const { number } = require("joi");

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getAllHod = async () => {
  try {
    const listResult = await User.aggregate([
      {
        $match: { active: true, role: "hod" },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: "$address",
      },
      {
        $project: {
          password: 0,
          profileImage: 0,
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
    ]);

    if (listResult) {
      return { data: listResult, status: true, code: 200 };
    } else {
      return { data: "HOD not found!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getAllHod;
