const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const DeviceConfigSchema = new mongoose.Schema(
  {
    flag:{
        type: String,
        unique: true
    },
    payload:{
        type: String
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
    timestamps: true,
    versionKey: false
  }
);

DeviceConfigSchema.plugin(toJSON);
DeviceConfigSchema.plugin(paginate);

DeviceConfigSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("DeviceConfiguration");
  doc.courseNo = `AT` + (1000 + doc.seqId);
  next();
});

const DeviceConfig = mongoose.model("deviceconfigurations", DeviceConfigSchema);
module.exports = DeviceConfig;
