const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    title: { type: String },
    titleEn: { type: String },
    description: { type: String },
    descriptionEn: { type: String },
    text: { type: String },
    textEn: { type: String },
    imgBg: { type: String },
    img: { type: [String] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const galleryModel = mongoose.model('Gallery', modelSchema);
module.exports = galleryModel;
