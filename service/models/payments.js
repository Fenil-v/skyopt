import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    paymentIntentId: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export default model("Payment", PaymentSchema);
