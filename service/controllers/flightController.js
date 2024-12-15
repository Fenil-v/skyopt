import Flight from "./../models/add-flight.js";
import dayjs from "dayjs";

export const addFlight = async (req, res) => {
  try {
    const {
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      price,
      numberOfStops,
      availableSeats,
    } = req.body;

    // Additional validation for date formats
    if (!Date.parse(departureTime) || !Date.parse(arrivalTime)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid date format for departure or arrival time",
      });
    }

    // Validate that arrival time is after departure time
    if (new Date(arrivalTime) <= new Date(departureTime)) {
      return res.status(400).json({
        status: 400,
        message: "Arrival time must be after departure time",
      });
    }

    // Your existing validation code...

    const newFlight = new Flight({
      flightNumber,
      airline,
      departureCity,
      arrivalCity,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      price: Number(price),
      numberOfStops: Number(numberOfStops) || 0,
      availableSeats: Number(availableSeats),
    });

    await newFlight.save();

    return res.status(201).json({
      status: 201,
      message: "Flight added successfully",
      data: newFlight,
    });
  } catch (error) {
    // Handle mongoose duplicate key error specifically
    if (error.code === 11000) {
      return res.status(409).json({
        status: 409,
        message: "Flight with this flight number already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Error adding flight",
      error: error.message,
    });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    const { flightNumber } = req.params;

    if (!flightNumber) {
      return res.status(400).json({
        status: 400,
        message: "Flight number is required",
      });
    } // Check if flight exists

    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      return res.status(404).json({
        status: 404,
        message: `Flight with flight number ${flightNumber} not found`,
      });
    } // Check if flight is in the past

    if (new Date(flight.departureTime) < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "Cannot delete past flights",
      });
    } // Delete the flight

    await Flight.findOneAndDelete({ flightNumber });

    return res.status(200).json({
      status: 200,
      message: "Flight deleted successfully",
      data: {
        flightNumber,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error deleting flight",
      error: error.message,
    });
  }
};

export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find(); // Fetch all flights
    return res.status(200).json({
      status: 200,
      message: "Flights retrieved successfully",
      data: flights,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error retrieving flights",
      error: error.message,
    });
  }
};

// Get flight details by flight number
export const getFlightDetails = async (req, res) => {
  try {
    const { flightNumber } = req.params;

    if (!flightNumber) {
      return res.status(400).json({
        status: 400,
        message: "Flight number is required",
      });
    }

    const flight = await Flight.findOne({ flightNumber });

    if (!flight) {
      return res.status(404).json({
        status: 404,
        message: `Flight with flight number ${flightNumber} not found`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Flight retrieved successfully",
      flight: flight,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error retrieving flight details",
      error: error.message,
    });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const { flightNumber } = req.params;
    const updateData = req.body; // Validate required fields if necessary

    const requiredFields = [
      "flightNumber",
      "airline",
      "departureCity",
      "arrivalCity",
      "departureTime",
      "arrivalTime",
      "price",
      "availableSeats",
    ];
    const missingFields = requiredFields.filter((field) => !updateData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } // Check if flight exists

    const flight = await Flight.findOneAndUpdate({ flightNumber }, updateData, {
      new: true,
    });
    if (!flight) {
      return res.status(404).json({
        status: 404,
        message: `Flight with flight number ${flightNumber} not found`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Flight updated successfully",
      data: flight,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error updating flight",
      error: error.message,
    });
  }
};

// Search for flights
export const searchFlights = async (req, res) => {
  try {
    const { departureCity, arrivalCity, date } = req.query;

    if (!departureCity?.trim() || !arrivalCity?.trim() || !date?.trim()) {
      return res.status(400).json({
        status: 400,
        message: "Departure city, arrival city, and date are required",
      });
    }

    // Create start and end of day for more precise searching
    const searchDate = dayjs(date);
    const startOfDay = searchDate.startOf("day");
    const endOfDay = searchDate.endOf("day");

    if (!searchDate.isValid()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid date format",
      });
    }

    const flights = await Flight.find({
      departureCity,
      arrivalCity,
      departureTime: {
        $gte: startOfDay.toDate(),
        $lte: endOfDay.toDate(),
      },
    }).sort({ departureTime: 1 });

    return res.status(200).json({
      status: 200,
      message: "Flights retrieved successfully",
      data: flights,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error retrieving flights",
      error: error.message,
    });
  }
};
