const mongoose = require('mongoose');
const { toJSON } = require('../../plugins');
const { tokenTypes } = require('../../config/tokens');
const counterIncrementor = require('../../utils/counterIncrementer');

// Check if the model has already been defined
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);

// Define the schema for the Token model
const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL, tokenTypes.SETUP_PASSWORD,tokenTypes.EDITION_PAYMENT,tokenTypes.PROFILE_INVITE,tokenTypes.SIGN_PROFILE_INVITE ,tokenTypes.SOCIAL_LOGIN],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    userProfileId:{
      type: mongoose.SchemaTypes.ObjectId,
      default:null
    },
    seqId:  {
      type: Number
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

// Add pre-save hook to generate sequence ID
tokenSchema.pre('save', async function (next) {
  const doc = this;
  doc.seqId = await counterIncrementor('Token')
  next();
});

// Export the Token model
module.exports = Token;
