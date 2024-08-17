const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const deviceConfigService = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const updateDeviceConfig = catchAsync(async (req, res) => {
  const { flag, payload } = await pick(req.body, ["flag", "payload"]);
  const user = req?.user

  const { id } = await pick(req.params, ["id"]);
  // console.log(flag, payload, user, id);
  const insertResult = await deviceConfigService.updateDeviceConfig(
    {
      flag,
      payload,
    },
    id,
    user
  );
  if (insertResult.status) {
    sendResponse(res, httpStatus.OK, insertResult, null);
  } else {
    if (insertResult.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
    } else if (insertResult.code == 500) {
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        insertResult.data
      );
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, insertResult.message, insertResult.data);
    }
  }
});

module.exports = updateDeviceConfig;
