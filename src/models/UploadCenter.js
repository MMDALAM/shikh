  const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
    },
    des: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    fileNameBeforeSave: {
      type: String,
    },
    fileNameExt: {
      type: String,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UploadCenter', modelSchema);
