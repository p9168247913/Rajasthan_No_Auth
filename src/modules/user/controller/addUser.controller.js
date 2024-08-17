const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const adminServices = require('../service');

const addUser = catchAsync(async (req, res) => {

    const { name, uniqueId, updateTime, } = await pick(req.body, ['name', 'uniqueId', 'updateTime'])

    const updateResult = await adminServices.addUserService( {name, uniqueId, updateTime,  });
   
    if (updateResult.status) {
        sendResponse(res, httpStatus.OK, updateResult, null);
    } else {
        if (updateResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
        }
        else if (updateResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, updateResult.data)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data)
        }
    }
});

module.exports = addUser
