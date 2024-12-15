import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Counter Schema to track the sequential IDs
const counterSchema = new Schema(
  {
    model: { type: String, required: true, unique: true },
    sequence_value: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Counter = model("Counter", counterSchema);

export default Counter;
