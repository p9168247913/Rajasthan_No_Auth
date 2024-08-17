const Joi = require("joi");
const { password, objectId } = require("../../utils/customValidations");

const signupUser = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `Name must contain value`,
      "any.required": `Name is a required field`,
    }),
    username: Joi.string().required().messages({
      "string.empty": `Username must contain value`,
      "any.required": `Username is a required field`,
    }),
    email: Joi.string()
      .email()
      .when('role', {
        is: 'device',
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.empty": `Email must contain value`,
        "string.email": `Email must be a valid email`,
        "any.required": `Email is a required field for non-device users`,
      }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`,
    }),
    role: Joi.string()
      .valid('device', 'IRM', 'district', 'admin', 'super-admin')
      .required()
      .messages({
        "string.empty": `Role must contain value`,
        "any.only": `Role must be one of 'device', 'IRM', 'district', 'admin', 'super-admin'`,
        "any.required": `Role is a required field`,
      }),
    district: Joi.string().allow("").messages({
      "string.empty": `District must contain value`,
    }),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid mail`,
    }),
    role: Joi.string().required(),
    district: Joi.string().allow(""),
  }),
};

const loginWithEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`,
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`,
    }),
  }),
};

const loginWithUsername = {
  body: Joi.object().keys({
    username: Joi.string().required().messages({
      "string.empty": `Username must contain value`,
      "any.required": `Username is a required field`,
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
    }),
  }),
};

module.exports = {
  signupUser,
  loginWithEmail,
  loginWithUsername,
  updateUser,
};
