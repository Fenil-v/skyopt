import express from "express";
import {
  cancelBooking,
  couponValidate,
  createBooking,
  getBooking,
  getUserBookings,
  updatePaymentStatus,
} from "../controllers/bookingController.js";
import { verify } from "../middleware/jwt_auth.js";

const router = express.Router();

router.post("/create", verify, createBooking);
router.get("/id/:bookingId", verify, getBooking);
router.put("/id/:bookingId/cancel", verify, cancelBooking);
router.get("/coupon-codes", verify, couponValidate);
router.get("/user-bookings", verify, getUserBookings);
router.patch("/:bookingId/payment-status", verify, updatePaymentStatus);

export default router;
