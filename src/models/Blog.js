const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    titleEn: {
      type: String,
    },
    descThumb: {
      type: String,
    },
    descThumbEn: {
      type: String,
    },
    description: {
      type: String,
    },
    descriptionEn: {
      type: String,
    },
    text: {
      type: String,
    },
    textEn: {
      type: String,
    },
    imgThumb: {
      type: String,
    },
    imgBg: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", modelSchema);
