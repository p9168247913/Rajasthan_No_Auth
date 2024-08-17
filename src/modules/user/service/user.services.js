const User = require("../user.model");
const bcrypt = require("bcryptjs");
const tokenServices = require("../../token/token.services");
const tokenService2 = require("../../../services/token.service");
const ApiError = require("../../../utils/ApiError");
const mongoose = require("mongoose");
const TOKEN = require("../../token/token.model");
const mailer = require("../../../mailer/mailer");

const isEmailTaken = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const isPhoneNoTaken = async (phoneNo) => {
  const user = await User.findOne({ phoneNo });
  return user;
};

const isUsernameTaken = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email, active: true });
};

const importUsers = async (usersData) => {
  try {
    const result = await User.create(usersData);
    if (result?.length) {
      return {
        status: true,
        code: 201,
        data: {
          result,
          importedUsers: result.length,
        },
      };
    }
  } catch (error) {
    return { status: false, code: 500, msg: error };
  }
};

const signupUser = async (userBody) => {
  function extractUsername(email) {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    } else {
      return email;
    }
  }
  const getuserName = extractUsername(userBody.email);
  const data = { ...userBody, username: getuserName };
  const user = await User.create(data);
  return user;
};

const isPasswordMatch = async (password, user) => {
  return bcrypt.compare(password, user.password);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createSocialUser = async (userBody) => {
  console.log(userBody.email, "testcreatsocialuser");
  if (await User.isEmailTaken(userBody.email)) {
    return {
      user: null,
      status: false,
      code: 403,
      data: { msg: "Email already taken" },
    };
  }
  if (await User.isUserNameTaken(userBody.username)) {
    return {
      user: null,
      status: false,
      code: 403,
      data: { msg: "Username already taken" },
    };
  }
  const user = await User.create(userBody);
  return user;
};

const getCurrentUser = async (token) => {
  try {
    const tokenVerify = await tokenServices.verifyToken(token, "refresh");
    if (tokenVerify?.user) {
      // const userData = await getUserById(tokenVerify?.user);
      const userData = await User.findOne({
        _id: tokenVerify?.user,
        active: true,
      });
      return { user: userData };
    } else if (tokenVerify?.msg) {
      return { status: false, code: 401, msg: tokenVerify?.msg };
    }
  } catch (error) {
    return { status: false, code: 500, msg: error };
  }
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getFbUserByFacebookId = async (facebookId) => {
  return User.findOne({ facebookId: facebookId });
};

const updateMyAccount = async ({ userId, userbody }) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      { $set: userbody },
      { new: true }
    );

    if (updatedUser) {
      return {
        status: true,
        data: updatedUser,
        code: 200,
      };
    } else {
      return {
        status: false,
        msg: "Something went wrong , please try again",
        code: 400,
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: error,
      code: 500,
    };
  }
};

const admingetUsersServices = async (page, limit, filter, sort) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;
    const filterQuery = {
      active: true,
    };

    if (filter && filter.search !== undefined && filter.search !== "") {
      var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
      filterQuery.$or = [{ name: { $regex: searchRegex } }];
    }

    if (filter && filter.brand !== undefined && filter.brand !== "") {
      filterQuery.brand = filter.brand;
    }
    // if (filter && filter.sold !== undefined) {

    // 	if (filter.sold === "false") { filterQuery.sold = filter.sold }
    // }

    let sortQuery = { _id: 1 };

    for (let key in sort) {
      if (sort.hasOwnProperty(key)) {
        let value = sort[key];
        let numericValue = Number(value);
        if (!isNaN(numericValue)) {
          sort[key] = numericValue;
        }
      }
    }
    if (sort != null) {
      sortQuery = sort;
    }
    const ProductList = await userModel
      .find(filterQuery)
      .skip(skip)
      .limit(length)
      .sort(sortQuery)
      .lean();
    const totalResults = await userModel.countDocuments(filterQuery);

    const totalPages = Math.ceil(totalResults / length);
    return {
      data: ProductList,
      totalPages,
      totalResults,
      page: start,
      limit: length,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.log("Error while getting product list :", error);
    return { status: false, code: 500, msg: error };
  }
};

// const resetPassword = async (email, newPassword, token) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return { status: false, code: 400, msg: "Email does not exist" };
//     }

//     const res = await TOKEN.findOne({ token: token, type: "resetPassword" });
//     if (!res) {
//       return { status: false, code: 400, msg: "Token not found" };
//     } else {
//       const expirationTimestamp = new Date(res.expires);
//       const currentTimestamp = new Date();
//       if (currentTimestamp > expirationTimestamp) {
//         return {
//           status: false,
//           code: 400,
//           msg: "Reset password link expired",
//         };
//       }

//       if (res.user.toString() !== user._id.toString()) {
//         return { status: false, code: 400, msg: "Invalid token for this user" };
//       }

//       user.password = newPassword;
//       await user.save();

//       await TOKEN.findOneAndUpdate(
//         { token: token },
//         { expires: currentTimestamp }
//       );
//       await mailer.sendResetCredentials({ email, newPassword });

//       return { status: true, code: 200, msg: "Password reset successfully" };
//     }
//   } catch (error) {
//     return {
//       status: false,
//       code: 500,
//       msg: "An error occurred: " + error.message,
//     };
//   }
// };

const resetPassword = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: false, code: 400, msg: "Email does not exist" };
    }

    user.password = newPassword;

    await user.save();

    await mailer.sendResetCredentials({ email, newPassword });

    return { status: true, code: 200, msg: "New Password sent successfully" };
  } catch (error) {
    return {
      status: false,
      code: 500,
      msg: "An error occurred: " + error.message,
    };
  }
};

const generateResetPasswordToken = async (email) => {
  try {
    const user = await isEmailTaken(email);

    if (!user) {
      return null;
    }
    const resetToken = tokenServices.generateResetPasswordToken(user.id);
    if (resetToken) {
      return resetToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const verifyToken = async (token) => {
  try {
    const expiry = await TOKEN.findOne({ token: token, type: "resetPassword" });
    const expirationTimestamp = new Date(expiry.expires);
    const currentTimestamp = new Date();
    if (currentTimestamp > expirationTimestamp) {
      return {
        status: false,
        code: 400,
        msg: "Reset Password link expired !!",
      };
    } else {
      const res = await TOKEN.findOneAndUpdate({ token: token });
      if (res) {
        return { status: true, code: 200, msg: "Verification successfully" };
      } else {
        return { status: false, code: 400, msg: "error occured" };
      }
    }
  } catch (error) {
    return error;
  }
};

function generatePassword(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#&";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
//new create user checkout
const getUserByEmailOrUsername = async (emailOrUsername) => {
  return await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
};
const newUser = async ({ ...userBody }) => {
  const userObj = {
    name: userBody?.name,
    username: userBody?.username,
    email: userBody?.email,
    password: userBody?.password,
    role: userBody?.role,
    district: userBody?.district,
  };
  const user = await User.create({ ...userObj });
  if (userBody?.email) {
    await mailer.sendUserCredentials(userObj);
  }
  return { data: user, status: true, code: 201 };
};

module.exports = {
  isEmailTaken,
  isPhoneNoTaken,
  isUsernameTaken,
  getUserById,
  signupUser,
  isPasswordMatch,
  getCurrentUser,
  getUserByEmail,
  createSocialUser,
  updateUserById,
  getFbUserByFacebookId,
  updateMyAccount,
  admingetUsersServices,
  generateResetPasswordToken,
  resetPassword,
  verifyToken,
  newUser,
  importUsers,
};
