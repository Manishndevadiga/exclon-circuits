const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileExtension: {
    type: String,
    required: true,
  },
  uploadDateTime: {
    type: Date,
    default: Date.now,
  },
});

const uploads = mongoose.model("uploads", uploadSchema);

module.exports = uploads;
