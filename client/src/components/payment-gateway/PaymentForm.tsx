import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import {
	Box,
	Button,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Divider,
} from "@mui/material";
import { useState } from "react";
import { createBookingPayment } from "../../services/_requests";
import axios from "axios";

interface PaymentFormProps {
	bookingId: string;
	amount: number;
	clientSecret: string;
	onPaymentSuccess?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
	bookingId,
	amount,
	clientSecret,
	onPaymentSuccess,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handlePayment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);
		setError(null);

		try {
			await createBookingPayment(bookingId);
			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/payment-success?booking_id=${bookingId}`,
					payment_method_data: {
						billing_details: {
							address: {
								country: "US",
							},
						},
					},
				},
				redirect: "always",
			});

			if (result.error) {
				setError(result.error.message || "Payment failed");
			} else {
				setSuccess(true);
				onPaymentSuccess?.();
			}
		} catch (err) {
			if (!axios.isCancel(err)) {
				setError("Payment failed. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	if (!clientSecret) {
		return <CircularProgress />;
	}

	return (
		<Paper elevation={3} sx={{ p: 3, mt: 2 }}>
			<Typography variant="h6" gutterBottom>
				Payment Details
			</Typography>
			<Divider sx={{ mb: 2 }} />

			<Box sx={{ mb: 2 }}>
				<Typography variant="subtitle1" gutterBottom>
					Amount to Pay: ${amount}
				</Typography>
			</Box>

			<form onSubmit={handlePayment}>
				<Box
					sx={{
						mb: 2,
					}}
				>
					<PaymentElement
						options={{
							layout: "tabs",
							paymentMethodOrder: ["card"],
							business: {
								name: "SkyOpt",
							},
						}}
					/>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity="success" sx={{ mb: 2 }}>
						Payment processed successfully!
					</Alert>
				)}

				<Button
					type="submit"
					disabled={!stripe || loading || success}
					variant="contained"
					fullWidth
					sx={{
						mt: 2,
						bgcolor: "#00256c",
						color: "white",
						py: 1.5,
						borderRadius: 2,
						textTransform: "none",
						fontSize: "1rem",
						"&:hover": {
							bgcolor: "#001845",
						},
					}}
				>
					{loading ? (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<CircularProgress size={20} color="inherit" />
							Processing...
						</Box>
					) : (
						`Pay $${amount}`
					)}
				</Button>
			</form>
		</Paper>
	);
};
