const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const DataPacketSchema = new mongoose.Schema(
  {
    stationId: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    placeName: {
      type: String,
    },
    panchayatSamiti: {
      type: String,
    },
    district: {
      type: String,
    },
    dateTime: {
      type: String,
      required: true,
    //   unique: true,
      // validate: {
      //     validator: async function(value) {
      //       if (value === "") return true;
      //       const count = await this.model('dataPacket').countDocuments({ dateTime: value });
      //       return count === 0;
      //     },
      //     message: 'dateTime must be unique'
      //   }
    },
    mobileNumber: {
      type: String,
    },
    batteryVoltage: {
      type: String,
    },
    waterTemperature: {
      type: String,
    },
    correctedWaterLevel: {
      type: String,
    },
    rawWaterLevel: {
      type: String,
    },
    atmosphericPressure: {
      type: String,
    },
    isFileCreated: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    seqId: {
      type: Number,
    },
  },
  {
    timestamps: false,
    versionKey: false
  }
);

DataPacketSchema.index({ stationId: 1, dateTime: 1 }, { unique: true });

DataPacketSchema.plugin(toJSON);
DataPacketSchema.plugin(paginate);

DataPacketSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("testData");
  doc.courseNo = `AT` + (1000 + doc.seqId);
  next();
});

const DataTestModel = mongoose.model("testData", DataPacketSchema);
module.exports = DataTestModel;
