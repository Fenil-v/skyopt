import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    passengerDetails: [
      {
        firstName: {
          type: String,
          required: true,
          trim: true,
        },
        lastName: {
          type: String,
          required: true,
          trim: true,
        },
        dateOfBirth: {
          type: Date,
          required: true,
        },
        seatNumber: {
          type: String,
          required: true,
        },
      },
    ],
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Booking", bookingSchema);
