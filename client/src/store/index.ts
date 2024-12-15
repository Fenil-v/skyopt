import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import flightReducer from "./slices/flight-store";
import bookingReducer from "./slices/bookingSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		bookings: bookingReducer,
		flights: flightReducer,
	},
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
