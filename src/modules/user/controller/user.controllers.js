const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const userServices = require("../service/user.services");
const tokenServices = require("../../token/token.services");
const { convertToJSON } = require("../../../utils/helper");
const { tokenTypes } = require("../../../config/tokens");
// const contacts = require('../../databaseJson/contacts.json');
const {
  resetPasswordMail,
  contactUsSendMail,
} = require("../../../utils/emailservice");

const importUsers = catchAsync(async (req, res) => {
  if (contacts.length) {
    const chunkSize = 100;
    const totalContacts = contacts.length;

    try {
      for (let i = 0; i < totalContacts; i += chunkSize) {
        const currentContacts = contacts.slice(i, i + chunkSize);

        const filtersContacts = currentContacts.map((contact) => ({
          fName: contact["First Name"] || "",
          lName: contact["Last Name"] || "",
          email: contact["Email 1"] || "",
          password: "Sample@123",
          phoneNo: parseInt(contact["Phone 1"]) || null,
          createdAt: new Date(contact["Created At (UTC+0)"]) || null,
        }));

        let addResponse = await userServices.importUsers(filtersContacts);

        if (!addResponse?.status) {
          sendResponse(
            res,
            addResponse?.code == 500
              ? httpStatus.INTERNAL_SERVER_ERROR
              : httpStatus.BAD_REQUEST,
            addResponse?.msg,
            null
          );
          return;
        }
      }

      // If all chunks are processed successfully
      sendResponse(res, httpStatus.OK, "Import successful", null);
    } catch (error) {
      console.error(error);
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        "Internal Server Error"
      );
    }
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, "Contacts Array Is Empty!");
  }
});

const signupUser = catchAsync(async (req, res) => {
  let user = req.body;
  let duplicateUsername = await userServices.isUsernameTaken(user?.username);
  if (duplicateUsername) {
    sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      `This username already taken, please use different username.`
    );
    return;
  }
  let duplicateEmail = await userServices.isEmailTaken(user?.email);
  if (duplicateEmail) {
    sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      `This email already registered with us, please use different email.`
    );
    return;
  }

  if (user) {
    let addResponse = await userServices.signupUser(user);
    if (addResponse) {
      const tokens = await tokenServices.generateAuthTokens(addResponse);

      return sendResponse(
        res,
        httpStatus.OK,
        { user: addResponse, tokens },
        null
      );
    }
  } else {
    return sendResponse(res, httpStatus.BAD_REQUEST, null, `User not added`);
  }
});

const newUser = catchAsync(async (req, res) => {
  try {
    const { name, username, email, role, district, password } = pick(req.body, [
      "name",
      "username",
      "email",
      "password",
      "role",
      "district",
    ]);

    let duplicateUsername = await userServices.isUsernameTaken(username);
    if (duplicateUsername) {
      sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        `This username is already registered with us, please use different username.`
      );
      return;
    }
    if (email) {
      let duplicateEmail = await userServices.isEmailTaken(email);
      console.log(duplicateEmail);

      if (duplicateEmail) {
        sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          null,
          `This email is already registered with us, please use different email.`
        );
        return;
      }
    }

    // let duplicatePhoneNo = await userServices.isPhoneNoTaken(phoneNo);
    // if (duplicatePhoneNo) {
    // 	sendResponse(res, httpStatus.BAD_REQUEST, null, `This phone number is already registered with us, please add another phone number.`);
    // 	return
    // }

    let addResponse = await userServices.newUser({
      name,
      username,
      email,
      password,
      role,
      district,
    });
    if (addResponse.status) {
      return sendResponse(res, httpStatus.OK, addResponse, null);
    } else {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        `User not added!!`
      );
    }
  } catch (error) {
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      error.message
    );
  }
});

const login = catchAsync(async (req, res) => {
  const {
    email = "",
    username = "",
    password,
  } = await pick(req.body, ["email", "username", "password"]);
  let user = null;
  if (email) {
    user = await userServices.isEmailTaken(email);
  } else if (username) {
    user = await userServices.isUsernameTaken(username);
  }
  if (user) {
    let checkPasswordMatch = await userServices.isPasswordMatch(password, user);
    if (checkPasswordMatch) {
      const tokens = await tokenServices.generateAuthTokens(user);
      sendResponse(res, httpStatus.OK, { user, tokens }, null);
      return;
    } else {
      sendResponse(res, httpStatus.UNAUTHORIZED, "Incorrect Password", null);
      return;
    }
  } else {
    sendResponse(
      res,
      httpStatus.NOT_FOUND,
      null,
      "User not found, please signup to login."
    );
    return;
  }
});

const getCurrentUser = catchAsync(async (req, res) => {
  const user = req.user;
  if (user) {
    sendResponse(res, httpStatus.OK, user, null);
    return;
  } else {
    sendResponse(res, httpStatus.BAD_REQUEST, null, "Something wen wrong!");
    return;
  }
  // const userRes = await userServices.getCurrentUser(token);
  // if (userRes && userRes?.user) {
  //     sendResponse(res, httpStatus.OK, userRes?.user, null)
  //     return
  // } else if (userRes && userRes?.code == 401) {
  //     sendResponse(res, httpStatus.UNAUTHORIZED, null, userRes?.msg);
  //     return
  // } else if (userRes && userRes?.code == 500) {
  //     sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, userRes?.msg);
  //     return
  // } else {
  //     sendResponse(res, httpStatus.BAD_REQUEST, null, "Something wen wrong!");
  //     return
  // }
});

const updateMyAccount = catchAsync(async (req, res) => {
  let userbody = req.body;
  let user = req.user;

  if (user) {
    let addResponse = await userServices.updateMyAccount({
      userId: user?.id,
      userbody,
    });
    if (addResponse.status) {
      return sendResponse(res, httpStatus.OK, addResponse.data, null);
    }
  } else {
    return sendResponse(res, httpStatus.BAD_REQUEST, null, addResponse?.msg);
  }
});

const admingetUsers = catchAsync(async (req, res) => {
  const { page, limit, filter, sort } = req.query;

  let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
  let result = await userServices.admingetUsersServices(
    page,
    limit,
    filter_Json_data,
    sort
  );
  if (result.status) {
    sendResponse(
      res,
      httpStatus.OK,
      {
        data: result?.data,
        totalResults: result?.totalResults,
        totalPages: result?.totalPages,
        page: result?.page,
        limit: result?.limit,
      },
      null
    );
  } else {
    if (result?.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result?.data);
    } else if (result?.code === 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result?.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result);
    }
  }
});

function generatePassword(length = 20) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

const resetPassword = catchAsync(async (req, res) => {
  const { email } = await pick(req.body, ["email"]);
  if (!email) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      "Email is required!"
    );
  }

  try {
    if (email) {
      const newPassword = generatePassword();
      const updateResult = await userServices.resetPassword(email, newPassword);

      if (updateResult.status) {
        sendResponse(
          res,
          httpStatus.OK,
          { message: "Password reset successfully" },
          null
        );
      } else if (updateResult.code === 400) {
        sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          { message: updateResult.msg },
          updateResult.msg
        );
      } else {
        sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          null,
          "Password reset failed"
        );
      }
    } else {
      sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        null,
        "Invalid or expired reset password token"
      );
    }
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      "An error occurred: " + error.message
    );
  }
});

const generateResetPasswordToken = catchAsync(async (req, res) => {
  const { email } = await pick(req.body, ["email"]);

  try {
    const resetPasswordToken =
      await userServices.generateResetPasswordToken(email);

    if (resetPasswordToken) {
      resetPasswordMail({
        to: email,
        emailBody: resetPasswordToken.resetPasswordToken,
      });
      sendResponse(res, httpStatus.OK, resetPasswordToken, null);
    } else {
      sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "User not found or Failed to generate reset password token"
      );
    }
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      "An error occurred: " + error.message
    );
  }
});

const verifyToken = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  try {
    const result = await userServices.verifyToken(id);
    if (result.status) {
      sendResponse(res, httpStatus.OK, null, "Email verified !!");
    } else if (result.code === 400) {
      sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Reset Password link expired !!"
      );
    } else {
      sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Failed to generate reset password token"
      );
    }
  } catch (error) {
    sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      "An error occurred: " + error
    );
  }
});

module.exports = {
  signupUser,
  login,
  getCurrentUser,
  updateMyAccount,
  admingetUsers,
  resetPassword,
  generateResetPasswordToken,
  verifyToken,
  newUser,
  importUsers,
};
