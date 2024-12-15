import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Define airport mappings
const airportMappings = {
  JFK: "New York (JFK)",
  LAX: "Los Angeles (LAX)",
  ORD: "Chicago (ORD)",
  ATL: "Atlanta (ATL)",
  DFW: "Dallas (DFW)",
  SFO: "San Francisco (SFO)",
  MIA: "Miami (MIA)",
  DEN: "Denver (DEN)",
  SEA: "Seattle (SEA)",
  BOS: "Boston (BOS)",
  LAS: "Las Vegas (LAS)",
  IAH: "Houston (IAH)",
  IAD: "Washington DC (IAD)",
  PHX: "Phoenix (PHX)",
  MCO: "Orlando (MCO)",
};

const validateCity = function (city) {
  if (!city) return false;

  const upperCity = city.toUpperCase();
  // Check if it's a valid airport code
  if (airportMappings[upperCity]) {
    return true;
  }

  // Check if it's a valid full city name
  return Object.values(airportMappings).includes(city);
};

const normalizeCity = function (city) {
  const upperCity = city.toUpperCase();
  // If it's an airport code, convert to full name
  if (airportMappings[upperCity]) {
    return airportMappings[upperCity];
  }
  // If it's already a full name, return as is
  if (Object.values(airportMappings).includes(city)) {
    return city;
  }
  throw new Error("Invalid city format");
};

const flightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[A-Z]{2,3}\d{3,4}$/,
        "Flight number must be 2-3 letters followed by 3-4 numbers",
      ],
    },
    airline: {
      type: String,
      required: true,
      enum: {
        values: [
          "American Airlines",
          "Delta Air Lines",
          "United Airlines",
          "Southwest Airlines",
          "JetBlue Airways",
          "Alaska Airlines",
          "Spirit Airlines",
          "Frontier Airlines",
        ],
        message: "{VALUE} is not a supported airline",
      },
    },
    departureCity: {
      type: String,
      required: true,
      validate: {
        validator: validateCity,
        message: (props) =>
          `${props.value} is not a valid city or airport code`,
      },
      set: normalizeCity,
    },
    arrivalCity: {
      type: String,
      required: true,
      validate: {
        validator: validateCity,
        message: (props) =>
          `${props.value} is not a valid city or airport code`,
      },
      set: normalizeCity,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [50, "Price must be at least $50"],
      max: [10000, "Price cannot exceed $10,000"],
    },
    numberOfStops: {
      type: Number,
      default: 0,
      min: [0, "Number of stops cannot be negative"],
      max: [3, "Maximum 3 stops allowed"],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [1, "Available seats must be at least 1"],
      max: [
        550,
        "Available seats cannot exceed maximum aircraft capacity of 550",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Add validation for flight duration
flightSchema.pre("save", function (next) {
  const durationInHours =
    (this.arrivalTime - this.departureTime) / (1000 * 60 * 60);

  if (durationInHours > 12) {
    next(
      new Error("Flight duration cannot exceed 12 hours for domestic flights")
    );
    return;
  }

  if (durationInHours < 0.5) {
    next(new Error("Flight duration must be at least 30 minutes"));
    return;
  }

  next();
});

export default model("Flight", flightSchema);
