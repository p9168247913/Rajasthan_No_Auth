const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require('./auth.service');
const tokenService = require('./token.service')
// const orgService = require("../organization/organization.service")
const { sendResponse } = require('../../utils/responseHandler');
const pick = require('../../utils/pick');
const { sendUserCredentials } = require('../../mailer/mailer');
const { generatePassword } = require('../../utils/generatePassword');
const User = require('../user/user.model');

const register = catchAsync(async (req, res) => {
  try {
    const {
      name,
      role,
      phoneNo,
      email,
      province,
      streetAddress,
      postalCode,
      city,
    } = pick(req.body, [
      "name",
      "role",
      "phoneNo",
      "streetAddress",
      "email",
      'postalCode',
      "city",
      "province"
    ]);

    const isEmailTaken = await authService.checkEmail(email)
    const genratePassword = await generatePassword(8)

    if (isEmailTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, "Email Already taken", null, null);
      return
    }
    let orgObj = {
      name,
      role,
      phoneNo,
      email,
      province,
      streetAddress,
      postalCode,
      password: genratePassword,
      city
    }

    const registration = await authService.register(orgObj)
    if (registration.status) {
      await sendUserCredentials(orgObj)
      sendResponse(res, httpStatus.CREATED, registration, null)
    } else {
      return { data: "User was not get register.", status: false, code: 400 };
    }
  } catch (error) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, error.message)
    console.error("Error in registration", error);
  }

});

const updateProfile = catchAsync(async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      email,
      province,
      streetAddress,
      profilePic,
      postalCode,
      city,

    } = pick(req.body, [
      "name",
      "phoneNo",
      "streetAddress",
      "email",
      'postalCode',
      "city",
      "profilePic",
      "province"
    ]);
    const userId = req.user._id;
    const isEmailTaken = await User.findOne({ _id: { $ne: userId }, email: email, active: true });
    if (isEmailTaken) {
      sendResponse(res, httpStatus.BAD_REQUEST, "Email Already taken", null, null);
      return
    }
    let orgObj = {
      name,
      phoneNo,
      email,
      profilePic,
      province,
      streetAddress,
      postalCode,
      city
    }
    const registration = await authService.updateProfile(orgObj, userId)
    if (registration.status) {

      sendResponse(res, httpStatus.CREATED, registration, null)
    } else {
      return { data: "User was not get register.", status: false, code: 400 };
    }
  } catch (error) {
    sendResponse(res, httpStatus.BAD_REQUEST, null, error.message)
    console.error("Error in registration", error);
  }

});



const adminHost = process.env.adminHost
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  /* INFO: Send error message in data directly just like below to maintain consistensy in APP */
  if (user && !user.user) {
    sendResponse(res, httpStatus.FORBIDDEN, null, user.msg);
    return;
  }
  const tokens = await tokenService.generateAuthTokens(user.user);
  sendResponse(res, httpStatus.OK, { user: user.user, tokens }, null);
});



const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const userId = req.user._id;
    const userRes = await authService.getCurrentUser(userId);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: true,
        data: { userData: userRes.userData, profileData: userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status: false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const { newpassword, previousPass } = req.body;
  const id = req.user._id;
  const resetPasswordRes = await authService.resetPassword(id, newpassword, previousPass);
  if (resetPasswordRes.status) {
    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      status: true,
      data: resetPasswordRes.data
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      status: false,
      data: resetPasswordRes.msg
    });
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
  getCurrentUser,
  updateProfile
};
