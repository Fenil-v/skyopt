import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../index";

interface PassengerDetail {
	firstName: string;
	lastName: string;
	seatNumber: string;
}

interface Booking {
	_id: string;
	flightNumber: string;
	bookingStatus: string;
	passengerDetails: PassengerDetail[];
	totalAmount: number;
	bookingDate: string;
	departureTime: string;
}

interface BookingState {
	bookings: Booking[];
	loading: boolean;
	error: string | null;
}

const initialState: BookingState = {
	bookings: [],
	loading: false,
	error: null,
};

const bookingSlice = createSlice({
	name: "bookings",
	initialState,
	reducers: {
		loadBookings: (state, action: PayloadAction<Booking[]>) => {
			state.bookings = action.payload;
			state.loading = false;
			state.error = null;
		},
		removeBooking: (state, action: PayloadAction<string>) => {
			state.bookings = state.bookings.filter(
				(booking) => booking._id !== action.payload
			);
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const selectBookings = (state: AppState): Booking[] =>
	state.bookings.bookings;
export const selectLoading = (state: AppState): boolean =>
	state.bookings.loading;
export const selectError = (state: AppState): string | null =>
	state.bookings.error;

export const { loadBookings, removeBooking, setLoading, setError } = bookingSlice.actions;

export default bookingSlice.reducer;
