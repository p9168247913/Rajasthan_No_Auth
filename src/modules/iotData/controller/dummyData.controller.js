const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const dataService = require("../service");
const { sendResponse } = require("../../../utils/responseHandler");
const User = require('../../user/user.model');
const bcrypt = require("bcryptjs");

/**
 * Parse incoming chunked data
 * @param {string} rawData - The raw data received from the IoT device
 * @returns {Object} - An object containing email, password, and CSV data
 */
const parseChunkedData = (rawData) => {
    const boundaries = rawData.split('---- boundary ----');
    const parsedData = [];

    boundaries.forEach(boundary => {
        const lines = boundary.trim().split('\n').filter(line => line.trim());
        if (lines.length >= 3) {
            const [credentials, csvData] = [lines[1], lines[2]];
            const [email, password, filename] = credentials.split(' ').map(param => param.split('=')[1]);
            parsedData.push({ email, password, csvData });
        }
    });

    return parsedData;
};

const dummyData = catchAsync(async (req, res) => {
  console.log('req.body:', req.body);
    const rawData = req.body; // Assuming the raw data is in req.body
    const parsedChunks = parseChunkedData(rawData);

    for (const chunk of parsedChunks) {
        const { email, password, csvData } = chunk;

        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, null, "Unauthorized user!");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, null, "Invalid credentials.");
        }

        // Convert CSV string to a buffer for processing
        const buffer = Buffer.from(csvData, 'utf-8');
        const file = { buffer, originalname: 'data.csv' }; // Simulate file object

        const insertResult = await dataService.addData(file);

        if (!insertResult.status) {
            return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.message);
        }
    }

    sendResponse(res, httpStatus.OK, { message: 'All data processed successfully.' }, null);
});

module.exports = dummyData;