const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const counterIncrementor = require('../../utils/counterIncrementer')

const processedFileSchema = new mongoose.Schema({
    filename: {
        type: String,
        unique: true
    },
    processedAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    seqId: {
        type: Number,
    }
}, {
    timestamps: true,
});

processedFileSchema.plugin(toJSON);
processedFileSchema.plugin(paginate);

processedFileSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('ProcessedFile');
    doc.courseNo = `AT` + (1000 + doc.seqId);
    next();
});

const ProcessedFile = mongoose.model('ProcessedFile', processedFileSchema);
module.exports = ProcessedFile
