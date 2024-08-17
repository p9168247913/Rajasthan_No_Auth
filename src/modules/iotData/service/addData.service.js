const DataModel = require("../dataModel");
const logger = require("../../../config/logger");

/**
 * Process and insert JSON payload data while avoiding duplicates
 * @param {Array<Object>} payload - Array of data objects to be inserted
 * @returns {Promise<Object>} - Returns a response object with status, data, and code
 */
const addData = async (payload) => {

  try {
    // const uniqueKeys = payload.map(data => ({
    //   stationId: data.stationId,
    //   dateTime: data.dateTime
    // }));

    // const existingEntries = await DataModel.find({
    //   $or: uniqueKeys.map(key => ({
    //     stationId: key.stationId,
    //     dateTime: key.dateTime
    //   }))
    // });

    // const existingKeys = new Set(existingEntries.map(entry => `${entry.stationId}_${entry.dateTime}`));

    // const uniqueData = payload.filter(data => {
    //   const key = `${data.stationId}_${data.dateTime}`;
    //   return !existingKeys.has(key);
    // });

    if (payload.length > 0) {
      
      const insertResult = await DataModel.insertMany(payload);
      return {
        status: true,
        code: 201,
        message: `${insertResult.length} new records added successfully.`,
        results: insertResult,
      };
    } else {
      return {
        status: true,
        code: 200,
        message: `All ${payload.length} records were duplicates and have been skipped.`,
      };
    }
  } catch (err) {
    logger.error("Error inserting data into database: ", err);
    return {
      status: false,
      code: 500,
      message: 'Error inserting data into database.',
      error: err.message,
    };
  }
};

module.exports = addData;


// ------ old code of csv file ------------


// const csv = require("csv-parser");
// const DataModel = require("../dataModel");
// const logger = require("../../../config/logger");
// const { Readable } = require('stream');
// const stream = require('stream');
// /**
//  * Upload and process CSV data
//  * @param {Object} file - The uploaded CSV file
//  * @returns {Promise<Object>} - Returns a response object with status, data, and code
//  */
// const addData = async (file) => {
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(file.buffer);
  
//     return new Promise((resolve, reject) => {
//       const results = [];
  
//       bufferStream
//         .pipe(
//           csv({
//             headers: [
//               'Station ID',
//               'Latitude',
//               'Longitude',
//               'Name of place',
//               'Panchayat Samiti',
//               'District',
//               'Date and Time',
//               'Mobile Number',
//               'Battery voltage',
//               'Water Temperature',
//               'Corrected Water Level',
//               'Raw water level',
//               'Atmospheric pressure',
//             ],
//             separator: ',',
//           })
//         )
//         .on('data', (data) => {
//           // Transform CSV data to the model's format
//           const newDataPacket = {
//             stationId: data['Station ID'],
//             latitude: data['Latitude'],
//             longitude: data['Longitude'],
//             placeName: data['Name of place'],
//             panchayatSamiti: data['Panchayat Samiti'],
//             district: data['District'],   
//             dateTime: data['Date and Time'],
//             mobileNumber: data['Mobile Number'],
//             batteryVoltage: data['Battery voltage'],
//             waterTemperature: data['Water Temperature'],
//             correctedWaterLevel: data['Corrected Water Level'],
//             rawWaterLevel: data['Raw water level'],
//             atmosphericPressure: data['Atmospheric pressure'],
//           };
//           results.push(newDataPacket);
//         })
//         .on('end', async () => {
//           try {
//             const insertResult = await DataModel.insertMany(results);
//             resolve({
//               status: true,
//               code: 201,
//               message: 'File processed successfully.',
//               results: insertResult,
//             });
//           } catch (err) {
//             reject({
//               status: false,
//               code: 500,
//               message: 'Error inserting data into database.',
//               error: err.message,
//             });
//           }
//         })
//         .on('error', (err) => {
//           reject({
//             status: false,
//             code: 500,
//             message: 'Error processing CSV file.',
//             error: err.message,
//           });
//         });
//     });
//   };
  
// module.exports = addData;