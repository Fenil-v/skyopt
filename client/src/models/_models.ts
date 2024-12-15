export interface AuthModel {
	data: AuthUserModel;
	status: number;
	message: string;
	payload: Array<unknown>;
	extra: Array<unknown>;
}

export interface AuthUserModel {
	email: string;
	username: string;
	token: string;
}
//signup
export interface SignUpPayload {
	firstName: string;
	lastName: string;
	phone: number | string;
	username: string;
	email: string;
	password: string;
	gender: string;
	dateOfBirth: string;
}
//login
export interface LoginPayload {
	email: string;
	password: string;
	rememberMe: boolean;
}

// Passenger Details
export interface PassengerDetail {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	seatNumber: string;
}

// Flight Details
export interface Flight {
	flightNumber: string;
	airline: string;
	departureCity: string;
	arrivalCity: string;
	departureTime: string;
	arrivalTime: string;
	price: number;
	numberOfStops: number;
	availableSeats: number;
}

export interface CouponCodeComponentProps {
	token: string;
}

export interface FlightResponse {
	flight: Flight;
}
