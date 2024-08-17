const DataPacket = require("../dataModel");
const logger = require("../../../config/logger");

const removeDuplicates = async () => {
  try {
    const duplicates = await DataPacket.aggregate([
      {
        $group: {
          _id: { dateTime: "$dateTime", stationId: "$stationId" },
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    let duplicatesFound = false;

    for (const duplicate of duplicates) {
      const [firstId, ...duplicateIds] = duplicate.ids;
      await DataPacket.deleteMany({ _id: { $in: duplicateIds } });
      duplicatesFound = true;
    }

    if (duplicatesFound) {
      logger.info("Duplicate removal complete");
    }
  } catch (error) {
    logger.error("Error removing duplicates:", error);
  }
};

module.exports = removeDuplicates;
