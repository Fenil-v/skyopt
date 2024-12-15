import express from "express";
import {
  addFlight,
  deleteFlight,
  getAllFlights,
  getFlightDetails,
  searchFlights,
  updateFlight,
} from "../controllers/flightController.js";
import { verify } from "../middleware/jwt_auth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/search", searchFlights);
router.post("/add", verify, isAdmin, addFlight);
router.delete("/:flightNumber", verify, isAdmin, deleteFlight);
router.get("/", getAllFlights);
router.get("/:flightNumber", getFlightDetails);
router.put("/update/:flightNumber", verify, isAdmin, updateFlight);

export default router;
