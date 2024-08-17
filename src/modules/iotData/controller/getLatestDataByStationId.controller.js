const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const dataService = require("../service");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const { convertToJSON } = require("../../../utils/helper");

const getLatestDataByStationId = catchAsync(async (req, res) => {
  const { page, limit, filter, sort } = await pick(req.query, [
    "page",
    "limit",
    "filter",
    "sort",
  ]);
  const user = req?.user
  let filter_Json_data = filter ? convertToJSON(filter) : undefined;
  const list = await dataService.getLatestDataByStationId(
    page,
    limit,
    filter_Json_data,
    sort,
    user
  );

  if (list && list.status) {
    sendResponse(res, httpStatus.OK, list, null);
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

module.exports = getLatestDataByStationId;
