const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Unique coupon code
    discount: { type: Number, required: true }, // Discount amount or percentage
    type: { type: String, enum: ["fixed", "percentage"], required: true }, // Type of discount
    isActive: { type: Boolean, default: true }, // Coupon status
    expiryDate: { type: Date, required: true }, // Expiration date
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);


const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;