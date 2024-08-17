const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const dataService = require("../service");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const { convertToJSON } = require("../../../utils/helper");

/**
 * Controller function to get all data from DataPacket model
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @returns {Promise<void>}
 */
const downloadAllData = catchAsync(async (req, res) => {
  const { filter, sort } = await pick(req.query, ["filter", "sort"]);
  const user = req?.user

  let filter_Json_data = filter ? convertToJSON(filter) : undefined;

  const list = await dataService.downloadAllData(filter_Json_data, sort, user);

  if (list.status) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    }
  }
});

module.exports = downloadAllData;
