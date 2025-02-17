const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  }

}, { timestamps: true });

module.exports = mongoose.model('support', messageSchema);