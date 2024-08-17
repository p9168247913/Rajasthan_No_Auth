const mongoose = require("mongoose");
const userModel = require("../user.model");

const updateParent = async (userId, reqBody) => {
  const userObj = {
    name: reqBody?.name,
    email: reqBody?.email,
    phone: reqBody?.phone,
    address: reqBody?.address,
  };
  try {
    const seriesearchQuery = { active: true, _id: userId };
    const updateResult = await userModel.findOneAndUpdate(
      seriesearchQuery,
      { ...userObj },
      { new: true }
    );
    if (updateResult) {
      return { data: updateResult, status: true, code: 200 };
    } else {
      return { data: "User Not Found!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = updateParent;
