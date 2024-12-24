import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Grid,
	Typography,
	Container,
	Box,
	StepLabel,
	Stepper,
	Step,
	Card,
	Chip,
	Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Flight, PassengerDetail } from "../../models/_models";
import {
	fetchFlightDetails,
	createBooking,
	fetchUserData,
} from "../../services/_requests";
import { getToken } from "../Helpers.tsx";
import { PaymentDialog } from "../payment-gateway/PaymentDialog";
import {
	AccessTime,
	LocationOn,
	Person,
	FlightOutlined,
} from "@mui/icons-material";
import NavBar from "../Navbar";
import BookingConfirmation from "./BookingConfirmation";

const CreateBookingForm: React.FC = () => {
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
	const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>(
		[{ firstName: "", lastName: "", dateOfBirth: "", seatNumber: "" }]
	);
	const [userName, setUserName] = useState<{
		firstName: string;
		lastName: string;
	}>({ firstName: "", lastName: "" });
	const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
	const token = getToken();
	const location = useLocation();

	const steps = ["Flight Selection", "Passenger Details", "Payment"];
	const [activeStep, setActiveStep] = useState(1);

	const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!selectedFlight) {
			console.error("No selected flight found.");
			return;
		}
		const bookingData = {
			flightNumber: selectedFlight.flightNumber,
			passengerDetails,
		};

		try {
			const data = await createBooking(bookingData, token);
			if (data) {
				setBookingConfirmation(data);
			} else {
				console.error("Error creating booking:", data.message);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		const flightNumber = new URLSearchParams(location.search).get(
			"flightNumber"
		);
		if (flightNumber) {
			fetchFlightDetails(flightNumber)
				.then((data) => {
					setSelectedFlight(data.flight);
				})
				.catch((error) =>
					console.error("Error fetching flight details:", error)
				);
		}
		const fetchUserDataAsync = async () => {
			if (token) {
				const userData = await fetchUserData();
				setUserName({
					firstName: userData.data.username,
					lastName: userData.data.lastName,
				});
			}
		};
		fetchUserDataAsync();
	}, [location.search]);

	const handlePassengerChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const values = [...passengerDetails];
		values[index][event.target.name as keyof PassengerDetail] =
			event.target.value;
		setPassengerDetails(values);
	};

	return (
		<>
			<NavBar userName={userName} />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Stepper activeStep={activeStep} sx={{ mb: 6 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{selectedFlight && (
					<Card
						elevation={3}
						sx={{
							mb: 4,
							borderRadius: 2,
							background:
								"linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
						}}
					>
						<Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
							<Grid container alignItems="center" spacing={2}>
								<Grid item>
									<FlightOutlined
										sx={{ color: "#2196f3", fontSize: 32 }}
									/>
								</Grid>
								<Grid item xs>
									<Typography variant="h5" fontWeight="600">
										{selectedFlight.departureCity} to{" "}
										{selectedFlight.arrivalCity}
									</Typography>
									<Typography color="text.secondary">
										{new Date(
											selectedFlight.departureTime
										).toLocaleDateString()}{" "}
										• {selectedFlight.airline}
									</Typography>
								</Grid>
								<Grid item>
									<Chip
										label="Direct Flight"
										color="primary"
										size="small"
										icon={<FlightOutlined />}
									/>
								</Grid>
							</Grid>
						</Box>

						<Box sx={{ p: 4 }}>
							<Grid container spacing={4} alignItems="center">
								<Grid item xs={4} textAlign="center">
									<Box>
										<Typography
											variant="h4"
											fontWeight="bold"
										>
											{new Date(
												selectedFlight.departureTime
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Typography>
										<Typography
											variant="subtitle1"
											color="text.secondary"
										>
											<LocationOn
												sx={{ fontSize: 16, mr: 0.5 }}
											/>
											{selectedFlight.departureCity}
										</Typography>
									</Box>
								</Grid>

								<Grid item xs={4} sx={{ position: "relative" }}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											sx={{
												color: "primary.main",
												fontWeight: 600,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												mb: 1,
											}}
										>
											<AccessTime
												sx={{ mr: 1, fontSize: 18 }}
											/>
											6h 33m
										</Typography>
										<Box
											sx={{
												height: 2,
												bgcolor: "primary.main",
												position: "relative",
												"&::after, &::before": {
													content: '""',
													position: "absolute",
													width: 8,
													height: 8,
													borderRadius: "50%",
													bgcolor: "primary.main",
													top: -3,
												},
												"&::after": { right: 0 },
												"&::before": { left: 0 },
											}}
										/>
									</Box>
								</Grid>

								<Grid item xs={4} textAlign="center">
									<Box>
										<Typography
											variant="h4"
											fontWeight="bold"
										>
											{new Date(
												selectedFlight.arrivalTime
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Typography>
										<Typography
											variant="subtitle1"
											color="text.secondary"
										>
											<LocationOn
												sx={{ fontSize: 16, mr: 0.5 }}
											/>
											{selectedFlight.arrivalCity}
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</Box>
					</Card>
				)}

				<Card elevation={3} sx={{ p: 4, borderRadius: 2 }}>
					<Typography
						variant="h5"
						gutterBottom
						sx={{ display: "flex", alignItems: "center" }}
					>
						<Person sx={{ mr: 1 }} />
						Passenger Details
					</Typography>
					<Divider sx={{ my: 3 }} />

					<form onSubmit={handleSubmit}>
						{passengerDetails.map((passenger, index) => (
							<Box
								key={index}
								sx={{
									mb: 4,
									p: 3,
									borderRadius: 2,
									bgcolor: "#f8f9fa",
								}}
							>
								<Typography variant="h6" gutterBottom>
									Passenger {index + 1}
								</Typography>
								<Grid container spacing={3}>
									<Grid item xs={12} md={3}>
										<TextField
											label="First Name"
											name="firstName"
											fullWidth
											variant="outlined"
											value={passenger.firstName}
											onChange={(e) =>
												handlePassengerChange(
													index,
													e as React.ChangeEvent<HTMLInputElement>
												)
											}
											required
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											label="Last Name"
											name="lastName"
											fullWidth
											value={passenger.lastName}
											onChange={(e) =>
												handlePassengerChange(
													index,
													e as React.ChangeEvent<HTMLInputElement>
												)
											}
											required
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											label="Date of Birth"
											name="dateOfBirth"
											type="date"
											fullWidth
											InputLabelProps={{ shrink: true }}
											value={passenger.dateOfBirth}
											onChange={(e) =>
												handlePassengerChange(
													index,
													e as React.ChangeEvent<HTMLInputElement>
												)
											}
											required
										/>
									</Grid>
									<Grid item xs={3}>
										<TextField
											label="Seat Number"
											name="seatNumber"
											fullWidth
											value={passenger.seatNumber}
											onChange={(e) =>
												handlePassengerChange(
													index,
													e as React.ChangeEvent<HTMLInputElement>
												)
											}
											required
										/>
									</Grid>
								</Grid>
							</Box>
						))}

						<Button
							type="submit"
							variant="contained"
							size="large"
							sx={{
								mt: 3,
								px: 6,
								py: 1.5,
								borderRadius: 2,
								background:
									"linear-gradient(45deg, #1a237e 30%, #283593 90%)",
								boxShadow:
									"0 3px 5px 2px rgba(26, 35, 126, .3)",
								"&:hover": {
									background:
										"linear-gradient(45deg, #283593 30%, #1a237e 90%)",
								},
							}}
						>
							Continue to Payment
						</Button>
					</form>
				</Card>

				{bookingConfirmation && bookingConfirmation.data.bookingId && (
					<>
						<BookingConfirmation
							bookingId={bookingConfirmation.data.bookingId}
							onProceedToPayment={() => {
								setActiveStep(2);
								setOpenPaymentDialog(true);
							}}
							amount={selectedFlight?.price || 0}
						/>
						<PaymentDialog
							open={openPaymentDialog}
							onClose={() => setOpenPaymentDialog(false)}
							bookingId={bookingConfirmation.data.bookingId}
							amount={selectedFlight?.price || 0}
						/>
					</>
				)}
			</Container>
		</>
	);
};

export default CreateBookingForm;
