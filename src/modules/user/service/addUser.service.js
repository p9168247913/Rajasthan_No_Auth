const mongoose = require("mongoose");
const userModel = require("../user.model");

const addUser = async (userBody) => {
  try {
    const updateResult = await userModel.create({ ...userBody });
    if (updateResult) {
      return { data: updateResult, status: true, code: 200 };
    } else {
      return { data: "User Not Found!", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = addUser;
