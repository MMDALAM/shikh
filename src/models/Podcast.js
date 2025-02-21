const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    title: { type: String },
    titleEn: { type: String },
    descThumb: { type: String },
    descThumbEn: { type: String },
    description: { type: String },
    descriptionEn: { type: String },
    text: { type: String },
    code1: { type: String },
    code2: { type: String },
    code3: { type: String },
    textEn: { type: String },
    imgThumb: { type: String },
    imgBg: { type: String },
    episode: { type: Number },
    season: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Podcast", modelSchema);
