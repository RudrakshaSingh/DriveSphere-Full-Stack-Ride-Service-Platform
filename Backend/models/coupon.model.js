const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Unique coupon code
    discount: { type: Number, required: true }, // Discount amount or percentage
    type: { type: String, enum: ["fixed", "percentage"], required: true }, // Type of discount
    isActive: { type: Boolean, default: true }, // Coupon status
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Automatically delete coupon 3 days (259200 seconds) after its creation
couponSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const couponModel = mongoose.model("Coupon", couponSchema);
module.exports = couponModel;
// 