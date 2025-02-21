const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: 'ورودی اجباری' },
    mobile: { type: String, unique: true, required: 'ورودی اجباری' },
    password: { type: String, required: 'ورودی اجباری' },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    phone: { type: String },
    isActive: { type: Boolean },
    scimage: { type: String },
    degree: { type: String },
    nc: { type: String },
    spotPlayerLicense: { type: String },
    hashIdPublic: { type: String, required: 'ورودی اجباری', unique: true },
    hashIdAuth: { type: String, required: 'ورودی اجباری', unique: true },
    podcastFavorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Podcast',
      default: [],
    },
    videocastFavorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Videocast',
      default: [],
    },
    audioBookFavorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'AudioBook',
      default: [],
    },
    qgameFavorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Qgame',
      default: [],
    },
    webinarFavorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Webinar',
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', modelSchema);