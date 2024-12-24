import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	CircularProgress,
	Container,
	Chip,
	Paper,
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Divider,
	useTheme,
	alpha,
} from "@mui/material";
import { FlightTakeoff, Person, Payment, Event } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
	selectBookings,
	selectLoading,
	removeBooking,
	selectError,
	loadBookings,
	setLoading,
	setError,
} from "../../store/slices/bookingSlice";
import { fetchBookings, cancelBooking } from "../../services/_requests";
import NavBar from "../Navbar";
import ToastAlert from "../ToastAlert";
import { ToastContainer } from "react-toastify";
import ExportToCsv from "../ExportCsv";
import { AppDispatch } from "../../store/index";
import { getToken } from "../Helpers.tsx";

const ViewBookings = () => {
	const dispatch = useDispatch<AppDispatch>();
	const theme = useTheme();

	// Redux state selectors
	const bookings = useSelector(selectBookings);
	const loading = useSelector(selectLoading);
	const error = useSelector(selectError);

	const [filterStatus, setFilterStatus] = useState<string | null>(null);
	const [filteredBookings, setFilteredBookings] = useState(bookings);

	useEffect(() => {
		const fetchBookingsFromRedux = async () => {
			dispatch(setLoading(true));
			const token = getToken();
			if (!token) {
				dispatch(setError("Token not found"));
				dispatch(setLoading(false));
				return;
			}
			try {
				const response = await fetchBookings(token);
				console.log(response.data);
				dispatch(loadBookings(response.data));
			} catch (err: any) {
				dispatch(setError(err.message));
			} finally {
				dispatch(setLoading(false));
			}
		};

		fetchBookingsFromRedux();
	}, [dispatch]);

	// Update filteredBookings when filterStatus or bookings change
	useEffect(() => {
		const filtered = bookings.filter((booking) => {
			const isCancelled =
				booking.bookingStatus.toLowerCase() === "cancelled";

			// If the filter status is set to "cancelled", include all cancelled bookings
			if (filterStatus === "cancelled") {
				return isCancelled;
			}

			// Otherwise, exclude cancelled bookings and apply the other filter statuses
			if (filterStatus) {
				return (
					!isCancelled &&
					booking.bookingStatus.toLowerCase() ===
						filterStatus.toLowerCase()
				);
			}

			// If no filter is selected, exclude cancelled bookings
			return !isCancelled;
		});
		setFilteredBookings(filtered);
	}, [filterStatus, bookings]);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "confirmed":
				return "success";
			case "pending":
				return "warning";
			case "cancelled":
				return "error";
			default:
				return "default";
		}
	};

	const handleFilterChange = (
		_event: React.MouseEvent<HTMLElement>,
		newStatus: string | null
	) => {
		setFilterStatus(newStatus);
	};

	const handleCancelBooking = async (bookingId: string) => {
		const token = getToken();
		if (!token) {
			console.error("Token not found");
			return;
		}

		try {
			const response = await cancelBooking(bookingId, token);

			// Dispatch action to update Redux state
			dispatch(removeBooking(bookingId));
			await ToastAlert({
				icon: "success",
				title: response.message || "Booking cancelled successfully",
			});
		} catch (error) {
			console.error("Error cancelling booking:", error);
			await ToastAlert({
				icon: "error",
				title: "Failed to cancel booking",
			});
		}
	};

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	return (
		<>
			<NavBar />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" gutterBottom>
						Your Bookings
					</Typography>
					<Paper
						elevation={0}
						sx={{
							p: 2,
							bgcolor: alpha(theme.palette.primary.main, 0.03),
							borderRadius: 2,
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<ToggleButtonGroup
								value={filterStatus}
								exclusive
								onChange={handleFilterChange}
								aria-label="booking status filter"
								sx={{ mb: 2 }}
							>
								<ToggleButton value="" aria-label="all">
									All
								</ToggleButton>
								<ToggleButton
									value="confirmed"
									aria-label="confirmed"
								>
									Confirmed
								</ToggleButton>
								<ToggleButton
									value="pending"
									aria-label="pending"
								>
									Pending
								</ToggleButton>
								<ToggleButton
									value="cancelled"
									aria-label="cancelled"
								>
									Cancelled
								</ToggleButton>
							</ToggleButtonGroup>

							<ExportToCsv token={getToken()} />
						</Box>
					</Paper>
				</Box>

				<Grid container spacing={3}>
					{filteredBookings.map((booking) => (
						<Grid item xs={12} key={booking._id}>
							<Card
								elevation={2}
								sx={{
									borderRadius: 2,
									transition: "0.3s",
									"&:hover": {
										transform: "translateY(-4px)",
										boxShadow: theme.shadows[4],
									},
								}}
							>
								<CardContent>
									<Grid container spacing={3}>
										<Grid item xs={12} md={8}>
											<Box sx={{ mb: 2 }}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														mb: 2,
													}}
												>
													<FlightTakeoff
														sx={{
															mr: 1,
															color: theme.palette
																.primary.main,
														}}
													/>
													<Typography variant="h6">
														Flight{" "}
														{booking.flightNumber}
													</Typography>
													<Chip
														label={
															booking?.bookingStatus ||
															"N/A"
														}
														color={getStatusColor(
															booking?.bookingStatus ||
																""
														)}
														size="small"
														sx={{ ml: 2 }}
													/>
												</Box>
											</Box>

											<Divider sx={{ my: 2 }} />

											<Box
												sx={{ display: "flex", gap: 4 }}
											>
												<Box>
													<Typography
														variant="body2"
														color="text.secondary"
													>
														<Person
															sx={{
																fontSize: 16,
																mr: 0.5,
															}}
														/>
														Passenger
													</Typography>
													<Typography variant="body1">
														{
															booking
																.passengerDetails[0]
																.firstName
														}{" "}
														{
															booking
																.passengerDetails[0]
																.lastName
														}
													</Typography>
												</Box>
												<Box>
													<Typography
														variant="body2"
														color="text.secondary"
													>
														<Event
															sx={{
																fontSize: 16,
																mr: 0.5,
															}}
														/>
														Departure Date
													</Typography>
													<Typography variant="body1">
														{new Date(
															booking.departureTime
														).toLocaleDateString()}
													</Typography>
												</Box>
												<Box>
													<Typography
														variant="body2"
														color="text.secondary"
													>
														<Payment
															sx={{
																fontSize: 16,
																mr: 0.5,
															}}
														/>
														Amount
													</Typography>
													<Typography
														variant="body1"
														fontWeight="500"
													>
														${booking.totalAmount}
													</Typography>
												</Box>
											</Box>
										</Grid>

										<Grid
											item
											xs={12}
											md={4}
											sx={{
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}
										>
											<Button
												variant="outlined"
												color="error"
												size="small"
												onClick={() =>
													handleCancelBooking(
														booking._id
													)
												}
												disabled={
													booking.bookingStatus.toLowerCase() ===
													"cancelled"
												}
											>
												Cancel Booking
											</Button>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
			<ToastContainer />
		</>
	);
};

export default ViewBookings;
