const httpStatus = require("http-status");
const pick = require("../../../utils/pick");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const adminServices = require("../service");

const updateUser = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);

  const { name, email, role, district } = await pick(req.body, [
    "name",
    "email",
    "role",
    "district",
  ]);
  const updateResult = await adminServices.updateUser(id, {
    name,
    email,
    role,
    district
  });
  if (updateResult.status) {
    sendResponse(res, httpStatus.OK, updateResult, null);
  } else {
    if (updateResult.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
    } else if (updateResult.code == 500) {
      sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        updateResult.data
      );
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
    }
  }
});

module.exports = updateUser;
