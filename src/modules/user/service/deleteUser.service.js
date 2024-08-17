const mongoose = require("mongoose");
const User = require("../user.model");

// const addressModel = require('../../address/address.model')

const deleteUser = async (userId) => {
  console.log(userId);
  try {
    // const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(userId) };
    const deleteResult = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { active: false },
      { new: true }
    );
    // const deleteAddress = await addressModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(deleteResult.address) }, { active: false }, { new: true })

    if (deleteResult) {
      return { data: "User deleted successfully!!", status: true, code: 200 };
    } else {
      return { data: "User Not Found!!", status: false, code: 400 };
    }
  } catch (error) {
    console.log(error.message);
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = deleteUser;
