import { Router } from "express";
import {
  handleWebhook,
  paymentIntent,
} from "../controllers/stripeController.js";
import express from "express";
import { verify } from "../middleware/jwt_auth.js";

const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);
router.post("/checkout", verify, paymentIntent);

export default router;
