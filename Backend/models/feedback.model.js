const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain", // Ensure the referenced model name is correct
    required: true,
  },
  overallExperience: {
    type: Number,
    required: true,
  },
  ratings: {
    vehicle: {
      type: Number,
      required: true,
    },
    safety: {
      type: Number,
      required: true,
    },
    behavior: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    cleanliness: {
      type: Number,
      required: true,
    }
  },
  message: {
    type: String,
  },
  email: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
