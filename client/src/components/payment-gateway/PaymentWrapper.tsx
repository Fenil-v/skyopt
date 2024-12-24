import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "./PaymentForm";
import { stripePromise } from "../../services/stripe";
import { Alert, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { getToken } from "../Helpers.tsx";
import { useState } from "react";
import { createPaymentIntent } from "../../services/_requests";
import axios from "axios";

export const PaymentWrapper: React.FC<{
	bookingId: string;
	amount: number;
}> = ({ bookingId, amount }) => {
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchPaymentIntent = async () => {
			try {
				setLoading(true);
				const token = getToken();
				const data = await createPaymentIntent(
					amount,
					bookingId,
					token,
					abortController.signal
				);
				setClientSecret(data.clientSecret);
			} catch (error) {
				if (!axios.isCancel(error)) {
					console.error("Error creating payment intent:", error);
					setError("Failed to initialize payment");
				}
			} finally {
				if (!abortController.signal.aborted) {
					setLoading(false);
				}
			}
		};

		if (clientSecret === null) {
			fetchPaymentIntent();
		}

		return () => {
			abortController.abort();
		};
	}, [bookingId, amount, clientSecret]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret: clientSecret || undefined,
				appearance: {
					theme: "stripe",
					variables: {
						colorPrimary: "#00256c",
					},
				},
			}}
		>
			<PaymentForm
				bookingId={bookingId}
				amount={amount}
				clientSecret={clientSecret || ""}
			/>
		</Elements>
	);
};
