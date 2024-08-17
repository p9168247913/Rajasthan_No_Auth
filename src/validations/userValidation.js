const Joi = require('joi');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
    employee_id: Joi.string().required(),
    department: Joi.string().required(),
    designation: Joi.string().required(),
    dateOfJoining: Joi.date().iso().required(),
    dob: Joi.date().iso().required(),
    gender: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    streetAddress: Joi.string(),
    bankingDetails: Joi.object({
        accountNumber: Joi.string(),
        bankName: Joi.string(),
        branchName: Joi.string(),
        ifscCode: Joi.string(),
        accountHolderName: Joi.string(),
    }),
    documents: Joi.object({
        certificate: Joi.string().required(),
        photo: Joi.string().required(),
        cv: Joi.string().required(),
    }),
    status: Joi.string().valid('active', 'inactive').default('active'),
    isDeleted: Joi.boolean().default(false),
    isBlocked: Joi.boolean().default(false),
    deletedAt: Joi.date(),
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

module.exports = { registerValidation, loginValidation };
