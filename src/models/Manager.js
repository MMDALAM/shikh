const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'ورودی اجباری',
    },
    password: {
      type: String,
      required: 'ورودی اجباری',
    },
    name: {
      type: String,
    },
    family: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hashIdPublic: {
      type: String,
      required: 'ورودی اجباری',
      unique: true,
    },
    hashIdAuth: {
      type: String,
      required: 'ورودی اجباری',
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Manager', modelSchema);
