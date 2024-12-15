import { createSlice, createSelector } from "@reduxjs/toolkit";

const flightSlice = createSlice({
	name: "flights",
	initialState: {
		flights: [],
	},
	reducers: {
		loadFlights: (state, action) => {
			state.flights = action.payload;
		},
	},
});

export const { loadFlights } = flightSlice.actions;

// Memoized selector
export const getFetchFlights = createSelector(
	(state) => state.flights.flights,
	(flights) => [...flights]
);

export default flightSlice.reducer;
