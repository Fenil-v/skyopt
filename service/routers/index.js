import userRouter from "../routers/userRouter.js";
import flightRouter from "../routers/flightRouter.js";
import bookingRouter from "../routers/bookingRouter.js";
import stripeRouter from "../routers/stripeRouter.js";

const initializeRoute = (app) => {
  app.use("/api/auth", userRouter);
  app.use("/api/flights", flightRouter);
  app.use("/api/bookings", bookingRouter);
  app.use("/api/payments", stripeRouter);
};

export default initializeRoute;
