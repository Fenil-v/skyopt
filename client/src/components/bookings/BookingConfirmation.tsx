import { Button, Divider } from "@mui/material";

import { CheckCircleOutline } from "@mui/icons-material";
import { alpha, Box, Typography } from "@mui/material";

import { Card } from "@mui/material";

const BookingConfirmation = ({
	bookingId,
	onProceedToPayment,
	amount,
}: {
	bookingId: string;
	onProceedToPayment: () => void;
	amount: number;
}) => {
	return (
		<Card
			elevation={0}
			sx={{
				maxWidth: 600,
				mx: "auto",
				mt: 4,
				borderRadius: 4,
				background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
				border: "1px solid",
				borderColor: "divider",
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					background: "linear-gradient(135deg, #4CAF50, #45a049)",
					py: 4,
					px: 3,
					textAlign: "center",
					color: "white",
				}}
			>
				<CheckCircleOutline sx={{ fontSize: 48, mb: 2 }} />
				<Typography variant="h4" fontWeight={600} gutterBottom>
					Booking Confirmed!
				</Typography>
			</Box>

			<Box sx={{ p: 4 }}>
				<Box
					sx={{
						mb: 4,
						p: 2,
						borderRadius: 2,
						bgcolor: alpha("#4CAF50", 0.1),
						border: "1px dashed",
						borderColor: "#4CAF50",
						textAlign: "center",
					}}
				>
					<Typography
						variant="subtitle2"
						color="text.secondary"
						gutterBottom
					>
						Booking ID
					</Typography>
					<Typography
						variant="h6"
						fontFamily="monospace"
						sx={{ letterSpacing: 1 }}
					>
						{bookingId}
					</Typography>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ textAlign: "center", mb: 4 }}>
					<Typography color="text.secondary" gutterBottom>
						Total Amount
					</Typography>
					<Typography variant="h3" fontWeight={700} color="primary">
						${amount}
					</Typography>
				</Box>

				<Button
					fullWidth
					variant="contained"
					onClick={onProceedToPayment}
					sx={{
						py: 2,
						bgcolor: "#1a237e",
						borderRadius: 3,
						fontSize: "1.1rem",
						fontWeight: 600,
						textTransform: "none",
						boxShadow: "0 4px 12px rgba(26, 35, 126, 0.2)",
						"&:hover": {
							bgcolor: "#0d1b6e",
							transform: "translateY(-2px)",
							boxShadow: "0 6px 16px rgba(26, 35, 126, 0.3)",
						},
						transition: "all 0.3s ease",
					}}
				>
					Proceed to Payment →
				</Button>
			</Box>
		</Card>
	);
};

export default BookingConfirmation;
