const mongoose = require("mongoose");
const userModel = require("../user.model");

const getUserById = async (userId) => {
  try {
    const seriesearchQuery = {
      active: true,
      _id: new mongoose.Types.ObjectId(userId),
    };
    let aggregateQuery = [
      { $match: seriesearchQuery },
      { $limit: 1 }, // Limiting the result to one document
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $project: {
          password: 0,
          profileImage: 0,
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
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
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const Result = await userModel.aggregate(aggregateQuery);

    if (Result.length > 0) {
      return { data: Result[0], status: true, code: 200 }; // Returning the first document as an object
    } else {
      return { data: "User Not Found!", status: false, code: 400 };
    }
  } catch (error) {
    console.log(error.message);
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getUserById;
