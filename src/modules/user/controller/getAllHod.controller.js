const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('../service');
const { sendResponse } = require('../../../utils/responseHandler');

const getAllHod = catchAsync(async (req, res) => {
    const list = await userService.getAllHod();
    if (list.status) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      if(list.code==400){
        sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
      }
      else if(list.code==500){
        sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,list.data)
      }
      else{
        sendResponse(res,httpStatus.BAD_REQUEST,null,list.data)
      }
    }
});

module.exports = getAllHod
