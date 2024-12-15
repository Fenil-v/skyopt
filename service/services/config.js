import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import initializeRoute from "../routers/index.js";

const initialize = (app) => {
  app.use(cors({ origin: "*" }));

  //explicity provide type for stripe hook
  app.use("/api/payments/webhook", express.raw({ type: "*/*" }));

  //don't change the order of this middleware
  app.use(express.json());
  mongoose.connect(process.env.MONGO_CONNECTION);
  initializeRoute(app);
};

export default initialize;
