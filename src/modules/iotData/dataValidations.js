const Joi = require("joi");
const { objectId } = require("../../validations/custom.validation");

const DataValidations = {
  body: Joi.object().keys({
    stationId: Joi.string().allow(""),
    latitude: Joi.string().allow(""),
    longitude: Joi.string().allow(""),
    placeName: Joi.string().allow(""),
    panchayatSamiti: Joi.string().allow(""),
    district: Joi.string().allow(""),
    dateTime: Joi.string().allow(""),
    mobileNumber: Joi.string().allow(""),
    batteryVoltage: Joi.string().allow(""),
    waterTemperature: Joi.string().allow(""),
    correctedWaterLevel: Joi.string().allow(""),
    rawWaterLevel: Joi.string().allow(""),
    atmosphericPressure: Joi.string().allow(""),
  }),
};

module.exports = DataValidations;
