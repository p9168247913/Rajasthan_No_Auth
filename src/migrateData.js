// const mongoose = require("mongoose");
// const logger = require("./config/logger");
// require("dotenv").config();
// const DataModel = require("./modules/iotData/dataModel");

// const sourceDbUrl = process.env.MONGODB_URL;
// const targetDbUrl = process.env.MONGODB_URL_2;

// // Create connections to both databases
// // const sourceConnection = mongoose.createConnection(sourceDbUrl, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// const targetConnection = mongoose.createConnection(targetDbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const DataPacketTarget = targetConnection.model(
//   "dataPacket",
//   DataModel.schema
// );

// async function migrateData() {
//   try {
//     const lastMigratedDocument = await DataPacketTarget.findOne().sort({ _id: -1 }).exec();

//     const criteria = lastMigratedDocument ? { _id: { $gt: lastMigratedDocument._id } } : {};

//     const newDocuments = await DataModel.find(criteria).exec();

//     if (newDocuments.length === 0) {
//       logger.info("No new DataPacket documents to migrate.");
//     } else {
//       await DataPacketTarget.insertMany(newDocuments);
//       logger.info(`Migrated ${newDocuments.length} new DataPacket documents successfully.`);
//     }

//     // Similarly, you can add migration logic for other collections here
//     // Uncomment the below code and replace CollectionName with actual model and target model
//     /*
//     await migrateCollection(AnotherCollectionSource, AnotherCollectionTarget, "AnotherCollection");
//     await migrateCollection(YetAnotherCollectionSource, YetAnotherCollectionTarget, "YetAnotherCollection");
//     */

//   } catch (error) {
//     logger.error("Error during data migration for DataPacket:", error);
//   }
// }

// async function migrateCollection(SourceModel, TargetModel, collectionName) {
//   try {
//     logger.info(`Starting migration for ${collectionName}...`);

//     const lastMigratedDocument = await TargetModel.findOne().sort({ _id: -1 }).exec();

//     const criteria = lastMigratedDocument ? { _id: { $gt: lastMigratedDocument._id } } : {};

//     const newDocuments = await SourceModel.find(criteria).exec();

//     if (newDocuments.length === 0) {
//       logger.info(`No new data to migrate for ${collectionName}.`);
//       return;
//     }

//     await TargetModel.insertMany(newDocuments);

//     logger.info(`Migrated ${newDocuments.length} new documents successfully for ${collectionName}.`);
//   } catch (error) {
//     logger.error(`Error during data migration for ${collectionName}:`, error);
//   }
// }

// module.exports = migrateData;
