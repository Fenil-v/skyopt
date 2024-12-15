import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Preferences Schema
const preferencesSchema = new Schema({
  currency: { type: String, default: "USD" },
  preferredAirlines: { type: [String], default: [] },
  maxStops: { type: Number, default: 0 },
  flightDurationRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 24 },
  },
});

// User Schema
const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[A-Za-z]+$/,
        "First name must contain only alphabetic characters",
      ],
      minlength: 1,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[A-Za-z]+$/,
        "Last name must contain only alphabetic characters",
      ],
      minlength: 1,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    passwordHash: { type: String, required: true },
    isFirstTimeCustomer: { type: Boolean, default: true }, // Default true for new users
    preferences: { type: preferencesSchema, default: () => ({}) },
    userRole: {
      type: String,
      enum: ["user", "admin"], // Only 'user' or 'admin' are allowed
      default: "user", // Default role is 'user'
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add a pre-save hook to update `updatedAt`
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("User", userSchema);
