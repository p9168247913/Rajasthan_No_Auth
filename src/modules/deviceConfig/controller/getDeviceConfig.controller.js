const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const deviceConfigService = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const { convertToJSON } = require("../../../utils/helper");

const getAllDeviceConfig = catchAsync(async (req, res) => {
  const { page, limit, filter, sort } = await pick(req.query, [
    "page",
    "limit",
    "filter",
    "sort",
  ]);
  const user = req?.user;
  const flag = req?.body.flag;
  let filter_Json_data = filter ? convertToJSON(filter) : undefined;
  const list = await deviceConfigService.getAllDeviceConfig(
    page,
    limit,
    filter_Json_data,
    sort,
    user,
    flag
  );
console.log(list);

  if (list && list.status) {
    // sendResponse(res, httpStatus.OK, list.data.payload, null);
    res
      .status(200)
      .json({
        code: 200,
        data: list?.data[0]?.payload ? list?.data[0]?.payload : null,
      });
  } else {
    if (list && list.code === 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list && list.code === 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        "Unexpected error occurred"
      );
    }
  }
});

module.exports = getAllDeviceConfig;
