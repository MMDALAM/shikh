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
    userType: {
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

module.exports = mongoose.model('History', modelSchema);
