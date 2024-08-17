const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");
const counterIncrementor = require("../../utils/counterIncrementer");

const ConfigLogSchema = new mongoose.Schema(
  {
    flag: {
      type: String,
    },
    payload: {
      type: String,
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
    versionKey: false,
  }
);

ConfigLogSchema.plugin(toJSON);
ConfigLogSchema.plugin(paginate);

ConfigLogSchema.pre("save", async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor("DeviceConfiguration");
  doc.courseNo = `AT` + (1000 + doc.seqId);
  next();
});

const ConfigLog = mongoose.model("ConfigLog", ConfigLogSchema);
module.exports = ConfigLog;
