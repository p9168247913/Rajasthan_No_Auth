const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const DeviceConfigService = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const User = require("../../user/user.model");
const bcrypt = require("bcryptjs");

const addDeviceConfig = catchAsync(async (req, res) => {
  const { flag, payload } = pick(req.body, ["flag", "payload"]);
  const user = req?.user

  const insertResult = await DeviceConfigService.addDeviceConfig({ flag, payload }, user);

  if (insertResult.status) {
    // sendResponse(res, httpStatus.OK, insertResult.message, null);
    res.status(200).json({
      code: 200
    });
  } else {
    if (insertResult.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.message);
    } else if (insertResult.code === 500) {
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        insertResult.message
      );
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.message);
    }
  }
});

module.exports = addDeviceConfig;
