import mongoose from "mongoose";
const { Schema, model } = mongoose;
import Counter from "../models/counter.js";

// Define the PersonalAccessToken schema
const personalAccessTokenSchema = new Schema(
  {
    tokenable_id: {
      type: Schema.Types.ObjectId, // This will refer to the user ID or another model if needed
      required: true,
    },
    name: {
      type: String,
      required: true,
      enum: ["auth_token", "mobile_token"],
      default: "auth_token",
    },
    token: {
      type: String,
      required: true,
      unique: true, // Ensures the token is unique
    },
    last_used_at: {
      type: Date,
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

// Pre-save hook to set the sequential ID
personalAccessTokenSchema.pre("save", async function (next) {
  try {
    // Get the latest counter value for PersonalAccessToken
    const counter = await Counter.findOneAndUpdate(
      { model: "PersonalAccessToken" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    // Set the ID to the updated sequence value
    this.id = counter.sequence_value;

    // Update the updated_at field
    this.updated_at = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

// Create the model
export default model("PersonalAccessToken", personalAccessTokenSchema);
