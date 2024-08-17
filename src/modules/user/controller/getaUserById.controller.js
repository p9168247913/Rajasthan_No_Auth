const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const adminServices = require("../service");

const getUserById = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);

  const Result = await adminServices.getUserById(id);
  if (Result.status) {
    sendResponse(res, httpStatus.OK, Result, null);
  } else {
    if (Result.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, Result.data);
    } else if (Result.code == 500) {
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        Result.data
      );
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, Result.data);
    }
  }
});

module.exports = getUserById;
