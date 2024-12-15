import mongoose from "mongoose";
const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    isFirstTimeUserOnly: { type: Boolean, default: false },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, required: true, min: 1 },
    timesUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model("Coupon", couponSchema);
