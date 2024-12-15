import { Button, Box, Grid, Typography, IconButton } from "@mui/material";
import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Flight } from "../../models/_models";
import { useNavigate } from "react-router-dom";
import FlightSegment from "./FlightSegment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";

interface FlightCardProps {
	flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [isFavorite, setIsFavorite] = useState(false);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([i18n.language], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const calculateDuration = (departureTime: string, arrivalTime: string) => {
		const departure = new Date(departureTime);
		const arrival = new Date(arrivalTime);
		const durationInMinutes =
			(arrival.getTime() - departure.getTime()) / (1000 * 60);
		const hours = Math.floor(durationInMinutes / 60);
		const minutes = Math.floor(durationInMinutes % 60);
		return `${hours}${t("hour")} ${minutes}${t("minute")}`;
	};

	const handleShare = async () => {
		const shareData = {
			title: `${t(flight.airline)} Flight`,
			text: `Check out this flight from ${t(flight.departureCity)} to ${t(
				flight.arrivalCity
			)} for $${flight.price}`,
			url: `${window.location.origin}/createBookings?flightNumber=${flight.flightNumber}`,
		};

		try {
			if (navigator.share && navigator.canShare(shareData)) {
				await navigator.share(shareData);
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	const duration = calculateDuration(
		flight.departureTime,
		flight.arrivalTime
	);
	const departureTime = formatTime(new Date(flight.departureTime));
	const arrivalTime = formatTime(new Date(flight.arrivalTime));

	const handleFavoriteClick = () => {
		setIsFavorite(!isFavorite);
	};

	return (
		<Card
			elevation={0}
			sx={{
				mb: 3,
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
				transition: "all 0.3s ease",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
				},
			}}
		>
			<Box sx={{ p: { xs: 2, sm: 4 } }}>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={12} sm={2}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<Box
								component="img"
								src={`/media/images/${flight.airline.toLowerCase()}.png`}
								alt={flight.airline}
								sx={{
									width: 40,
									height: 40,
									objectFit: "contain",
								}}
							/>
							<Typography
								sx={{
									fontWeight: 600,
									color: "text.primary",
								}}
							>
								{t(flight.airline)}
							</Typography>
						</Box>
					</Grid>

					<Grid item xs={12} sm={7}>
						<FlightSegment
							time1={departureTime}
							time2={arrivalTime}
							city1={t(flight.departureCity)}
							city2={t(flight.arrivalCity)}
							duration={duration}
							airline={t(flight.airline)}
						/>
					</Grid>

					<Grid item xs={12} sm={3}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: {
									xs: "flex-start",
									sm: "flex-end",
								},
								gap: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<Typography
									sx={{
										fontSize: "0.9rem",
										color: "success.main",
										fontWeight: 600,
									}}
								>
									{flight.availableSeats} {t("seats left")}
								</Typography>
								<Box sx={{ display: "flex", gap: 0.5 }}>
									<IconButton
										size="small"
										onClick={handleFavoriteClick}
										sx={{
											color: isFavorite
												? "error.main"
												: "action.disabled",
											"&:hover": { color: "error.main" },
										}}
									>
										{isFavorite ? (
											<FavoriteIcon />
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
									<IconButton
										size="small"
										onClick={handleShare}
										sx={{
											color: "action.disabled",
											"&:hover": {
												color: "primary.main",
											},
										}}
									>
										<ShareIcon />
									</IconButton>
								</Box>
							</Box>

							<Typography
								variant="h4"
								sx={{
									fontWeight: 700,
									color: "primary.main",
								}}
							>
								${flight.price}
							</Typography>

							<Button
								variant="contained"
								onClick={() =>
									navigate(
										`/en/createBookings?flightNumber=${flight.flightNumber}`
									)
								}
								sx={{
									bgcolor: "primary.main",
									px: 4,
									py: 1.5,
									borderRadius: 2,
									textTransform: "none",
									fontSize: "1rem",
									fontWeight: 600,
									boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
									"&:hover": {
										bgcolor: "primary.dark",
										transform: "translateY(-2px)",
										boxShadow:
											"0 6px 16px rgba(0,0,0,0.15)",
									},
								}}
							>
								{t("Select")} →
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
};

export default FlightCard;
