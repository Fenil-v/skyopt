import axios from "axios";
import {
	Flight,
	FlightResponse,
	LoginPayload,
	SignUpPayload,
} from "../models/_models";
import store from "../store";
import { setAuthToken } from "../store/slices/authSlice";
import { getToken } from "../components/Helpers.tsx";
const API_URL = import.meta.env.VITE_APP_API_URL;

//user verify
export const getUserByToken = async (token: string) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	return axios
		.get(`${API_URL}auth/user-meta-data`, { headers: headers })
		.then((response) => response);
};

//user meta data
export const fetchUserData = async () => {
	const token = getToken();
	if (!token) {
		console.error("Token not found");
		return;
	}

	try {
		const response = await getUserByToken(token);
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
};

// Signup function
export const signUp = async (data: SignUpPayload) => {
	const response = await axios.post(`${API_URL}auth/sign-up`, data);
	return response.data;
};

//login function
export const login = async (data: LoginPayload) => {
	try {
		const response = await axios.post(`${API_URL}auth/login`, data);
		const token = response.data?.data?.token;
		store.dispatch(setAuthToken(token));
		return {
			status: response.status,
			message: response.data?.message,
			token,
		};
	} catch (err) {
		console.error(err);
		throw new Error("Login failed");
	}
};

export const logout = async (token: string) => {
	const response = await axios.get(`${API_URL}auth/logout`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

// Create a booking
export async function createBooking(bookingData: any, token: string) {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	const response = await axios.post(
		`${API_URL}bookings/create`,
		bookingData,
		{
			headers,
		}
	);
	return response.data;
}

// Fetch flight details by flight number
export async function fetchFlightDetails(flightNumber: string) {
	const response = await axios.get<FlightResponse>(
		`${API_URL}flights/${flightNumber}`
	);
	return response.data;
}

// Fetch flights
export async function fetchFlights() {
	const response = await axios.get(`${API_URL}flights`);
	return response.data;
}

export const eligibleCoupons = async (token: string) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	return axios
		.get(`${API_URL}bookings/coupon-codes`, { headers })
		.then((response) => response);
};

// Fetch bookings
export const fetchBookings = async (token: string) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	const response = await axios.get(`${API_URL}bookings/user-bookings`, {
		headers,
	});
	return response.data;
};

// Edit user function
export const editUser = async (data: any) => {
	const token = getToken(); // Retrieve the token
	if (!token) {
		console.error("Token not found");
		throw new Error("Unauthorized");
	}

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	return axios
		.put(`${API_URL}auth/edit-user`, data, { headers }) // Adjust the endpoint as necessary
		.then((response) => response.data);
};

// Cancel a booking
export const cancelBooking = async (bookingId: string, token: string) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	return axios
		.put(`${API_URL}bookings/id/${bookingId}/cancel`, {}, { headers })
		.then((response) => response.data);
};

export const createFlight = async (flight: Flight): Promise<Flight> => {
	const token = getToken();
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	// Send the entire flight object, not just flight.airline
	const response = await axios.post(`${API_URL}flights/add`, flight, {
		headers,
	});
	return response.data.data; // Access the data property from the response
};

export const updateFlight = async (flightNumber: string, flight: Flight) => {
	const token = getToken();
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	const response = await axios.put(
		`${API_URL}flights/update/${flightNumber}`,
		flight,
		{ headers }
	);

	return response.data;
};

export const deleteFlight = async (flightNumber: string): Promise<void> => {
	try {
		// Validate flight number
		if (!flightNumber) {
			throw new Error("Flight number is required");
		}

		const token = getToken();
		if (!token) {
			throw new Error("Authentication token is missing");
		}

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
		const url = `${API_URL}flights/${flightNumber}`;

		const response = await axios.delete(url, { headers });

		// Handle successful response
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorMessage = error.response?.data?.message || error.message;

			switch (error.response?.status) {
				case 400:
					// Handles both missing flight number and past flight cases
					throw new Error(errorMessage);
				case 404:
					throw new Error(errorMessage);
				case 401:
					throw new Error("Unauthorized: Invalid or expired token");
				case 500:
					throw new Error("Server error: Unable to delete flight");
				default:
					throw new Error(`Failed to delete flight: ${errorMessage}`);
			}
		}
		throw error;
	}
};

export const fetchFlightsByCriteria = async (
	departureCity: string,
	arrivalCity: string,
	date: string
) => {
	const formattedDate = new Date(date).toISOString();

	return await axios.get(`${API_URL}flights/search`, {
		params: {
			departureCity,
			arrivalCity,
			date: formattedDate,
		},
		paramsSerializer: {
			serialize: (params) => {
				return new URLSearchParams(params).toString();
			},
		},
	});
};

// Create Payment Intent
export const createPaymentIntent = async (
	amount: number,
	bookingId: string,
	token: string,
	signal?: AbortSignal
) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	const response = await axios.post(
		`${API_URL}payments/checkout`,
		{
			amount: amount * 100,
			currency: "usd",
			bookingId: bookingId,
		},
		{
			headers,
			signal,
		}
	);
	return response.data;
};

// Update booking payment status
export const createBookingPayment = async (bookingId: string) => {
	const token = getToken();
	if (!token) {
		throw new Error("Unauthorized");
	}

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};

	const response = await axios.patch(
		`${API_URL}bookings/${bookingId}/payment-status`,
		{
			status: "completed",
		},
		{
			headers,
		}
	);
	return response.data;
};
