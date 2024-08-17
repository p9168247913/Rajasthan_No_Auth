const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const dataService = require("../service");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const User = require("../../user/user.model");
const bcrypt = require("bcryptjs");

const addData = catchAsync(async (req, res) => {
  const { username, password, type, payload } = pick(req.body, [
    "username",
    "password",
    "type",
    "payload",
  ]);

  if (!type) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      "Select type of data(either prod or qc)"
    );
  }

  // const user = await User.findOne({ username });
  // if (!user) {
  //   return sendResponse(
  //     res,
  //     httpStatus.UNAUTHORIZED,
  //     null,
  //     "Unauthorized user!"
  //   );
  // }

  // const isPasswordMatch = await bcrypt.compare(password, user.password);
  // if (!isPasswordMatch) {
  //   return sendResponse(
  //     res,
  //     httpStatus.UNAUTHORIZED,
  //     null,
  //     "Invalid credentials."
  //   );
  // }

  if (type == "prod" || type == "qc") {
    const expectedHeaders = [
      "stationId",
      "latitude",
      "longitude",
      "placeName",
      "panchayatSamiti",
      "district",
      "dateTime",
      "mobileNumber",
      "batteryVoltage",
      "waterTemperature",
      "correctedWaterLevel",
      "rawWaterLevel",
      "atmosphericPressure",
    ];

    const invalidIndices = []; // Array to hold indices of invalid packets

    const parsedPayload = payload.map((item, index) => {
      const values = item.split(",").map((val) => val.trim());

      // Check if each packet has the correct number of comma-separated values
      if (values.length !== expectedHeaders.length) {
        invalidIndices.push(index);
        return null; // Skip this packet
      }

      // Extract and validate specific fields
      const batteryVoltage = values[8];
      const waterTemperature = values[9];
      const correctedWaterLevel = values[10];
      const rawWaterLevel = values[11];
      const atmosphericPressure = values[12];

      // Validate that the specific fields are either a float or "--"
      const validFloatOrDash = (val) =>
        val === "--" || !isNaN(parseFloat(val));

      if (
        !validFloatOrDash(batteryVoltage) ||
        !validFloatOrDash(waterTemperature) ||
        !validFloatOrDash(correctedWaterLevel) ||
        !validFloatOrDash(rawWaterLevel) ||
        !validFloatOrDash(atmosphericPressure)
      ) {
        invalidIndices.push(index);
        return null; // Skip this packet
      }

      // Create the data packet
      const dataPacket = {};
      expectedHeaders.forEach((key, index) => {
        dataPacket[key] = values[index];
      });

      return dataPacket;
    }).filter((packet) => packet !== null); // Remove invalid packets

    let insertResult;
    if (type === "prod") {
      insertResult = await dataService.addData(parsedPayload);
    }
    if (type === "qc") {
      insertResult = await dataService.addTestData(parsedPayload);
    }

    if (insertResult.status) {
      // Include invalid indices in the response
      res.status(200).json({
        code: 200,
        body: invalidIndices.length ? invalidIndices.join(",") : "--",
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
  } else {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      "Select type of data(either prod or qc)"
    );
  }
});

module.exports = addData;
