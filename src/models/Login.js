const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
    },
    useragent: {
      type: Object,
    },
    data: {
      type: Object,
    },
    data: {
      type: Object,
    },
    type: {
      type: String,
    },
    userType: {
      type: String,
    },
    status: {
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

module.exports = mongoose.model('Login', modelSchema);
