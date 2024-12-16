import Booking from "../models/booking.js";
import Payment from "../models/payments.js";
import Flight from "../models/add-flight.js";
import Coupon from "../models/coupen.js";
import moment from "moment";
import User from "../models/user.js";

export const createBooking = async (req, res) => {
  try {
    const { flightNumber, passengerDetails } = req.body;
    const userId = req.user.id;
    
    // Validate request body
    if (
      !flightNumber ||
      !passengerDetails ||
      !Array.isArray(passengerDetails)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request body",
      });
    }

    // Find the flight
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      return res.status(404).json({
        status: 404,
        message: "Flight not found",
      });
    }

    // Check if flight departure time has passed
    if (new Date(flight.departureTime) < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "Cannot book a past flight",
      });
    }

    // Check if enough seats are available
    if (flight.availableSeats < passengerDetails.length) {
      return res.status(400).json({
        status: 400,
        message: "Not enough seats available",
      });
    }

    // Calculate total amount
    const totalAmount = flight.price * passengerDetails.length;

    // Create booking
    const booking = new Booking({
      userId,
      flightId: flight._id,
      flightNumber,
      passengerDetails,
      totalAmount,
    });

    // Save booking
    await booking.save();

    // Update available seats
    flight.availableSeats -= passengerDetails.length;
    await flight.save();

    return res.status(201).json({
      status: 201,
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        flightDetails: flight,
        passengerDetails,
        totalAmount,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate("flightId")
      .populate("userId", "username email");

    if (!booking) {
      return res.status(404).json({
        status: 404,
        message: "Booking not found",
      });
    }

    // Ensure user can only access their own bookings
    if (booking.userId._id.toString() !== userId) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access to booking",
      });
    }

    return res.status(200).json({
      status: 200,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error retrieving booking",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        status: 404,
        message: "Booking not found",
      });
    }

    // Ensure user can only cancel their own bookings
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access to booking",
      });
    }

    // Check if booking is already cancelled
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        status: 400,
        message: "Booking is already cancelled",
      });
    }

    // Check if flight departure time is within 24 hours
    const flight = await Flight.findById(booking.flightId);
    const timeDiff = new Date(flight.departureTime) - new Date();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({
        status: 400,
        message: "Cannot cancel booking within 24 hours of departure",
      });
    }

    // Update booking status
    booking.bookingStatus = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    // Restore available seats
    flight.availableSeats += booking.passengerDetails.length;
    await flight.save();

    return res.status(200).json({
      status: 200,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

export const couponValidate = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the logged-in user details
    const loggedUser = await User.findById(userId);

    if (!loggedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        coupon: false,
        couponCode: null,
      });
    }

    // Check if the user has any bookings in the Booking model
    const existingBookings = await Booking.findOne({
      userId: loggedUser._id,
    });

    if (existingBookings) {
      return res.status(200).json({
        status: 200,
        message: "User has existing bookings, no coupon available.",
        coupon: false,
        couponCode: null,
      });
    }
    // Look for the coupon for first-time users
    const coupon = await Coupon.findOne({
      isFirstTimeUserOnly: true,
    }).sort({ validFrom: -1 });

    if (!coupon) {
      return res.status(404).json({
        status: 404,
        message: "No valid coupon found for first-time users",
        coupon: false,
        couponCode: null,
      });
    }

    // Return the coupon code if valid
    return res.status(200).json({
      status: 200,
      message: "Coupon found",
      coupon: true,
      couponCode: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req.user.id;
  try {
    // Fetch all bookings for the user
    const bookings = await Booking.find({ userId })
      .select("-paymentStatus")
      .lean();

    const bookingDetails = await Promise.all(
      bookings.map(async (booking) => {
        // Fetch flight details for the current booking
        const flight = await Flight.findById(booking.flightId)
          .select("departureTime arrivalTime")
          .lean();

        const payments = await Payment.find({
          bookingId: booking._id,
        }).lean();

        return {
          ...booking,
          departureTime: flight?.departureTime || null,
          arrivalTime: flight?.arrivalTime || null,
          payments:
            payments.length > 0
              ? payments
              : [
                  {
                    status: "pending",
                    amount: 0,
                    currency: null,
                  },
                ],
        };
      })
    );
    return res.status(200).json({ success: true, data: bookingDetails });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        status: 404,
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized access to booking",
      });
    }

    // Update booking status
    booking.paymentStatus = status;
    booking.bookingStatus = "confirmed";
    booking.updatedAt = new Date();

    await booking.save();

    // Find associated payment and update its status
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date();
      await payment.save();
    }

    return res.status(200).json({
      status: 200,
      message: "Payment status updated successfully",
      data: {
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error updating payment status",
      error: error.message,
    });
  }
};
