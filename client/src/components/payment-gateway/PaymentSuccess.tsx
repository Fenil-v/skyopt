import { Typography, Container, Paper, Box, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
	const navigate = useNavigate();

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
				<Box sx={{ mb: 3 }}>
					<CheckCircleIcon
						sx={{ fontSize: 60, color: "success.main" }}
					/>
				</Box>
				<Typography variant="h4" gutterBottom>
					Payment Successful!
				</Typography>
				<Typography color="text.secondary">
					Your booking has been confirmed and your payment has been
					processed successfully.
				</Typography>
				<Button
					sx={{ marginTop: 5 }}
					variant="contained"
					onClick={() => navigate("/")}
				>
					Go to Home
				</Button>
			</Paper>
		</Container>
	);
};

export default PaymentSuccessPage;
