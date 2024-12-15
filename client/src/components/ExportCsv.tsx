import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { fetchBookings } from "../services/_requests";
import ToastAlert from "./ToastAlert";

const ExportToCsv = ({ token }: { token: string }) => {
	const today = dayjs().format("YYYY-MM-DD");
	const handleExport = async () => {
		try {
			// Fetch booking data
			const data = await fetchBookings(token);
			const bookings = data.data;
			const exportKeys = [
				"_id",
				"flightId",
				"flightNumber",
				"bookingStatus",
				"totalAmount",
				"bookingDate",
				"departureTime",
				"arrivalTime",
			];

			if (bookings.length > 0) {
				const csvContent = [
					// Generate headers
					exportKeys.join(","),
					// Generate rows
					...bookings.map((row: Record<string, any>) =>
						exportKeys.map((key) => row[key]).join(",")
					),
				].join("\n");
				// Create and download CSV _
				const blob = new Blob([csvContent], {
					type: "text/csv;charset=utf-8;",
				});
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `bookings-${today}.csv`);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				await ToastAlert({
					icon: "success",
					title: "CSV exported successfully",
					timer: 2500,
				});
			} else {
				await ToastAlert({
					icon: "success",
					title: "No Data Found",
					timer: 2500,
				});
			}
		} catch (error) {
			console.error("Error exporting bookings:", error);
			alert("Failed to fetch bookings. Please try again.");
		}
	};

	return (
		<>
			<Button
				variant="contained"
				color="primary"
				sx={{
					padding: "10px 20px",
					margin: "10px",
					fontSize: "16px",
					// Prevent all caps
					textTransform: "none",
				}}
				onClick={handleExport}
			>
				Export To CSV
			</Button>
		</>
	);
};

export default ExportToCsv;
