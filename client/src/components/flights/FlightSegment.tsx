import { Typography, Box, useTheme } from "@mui/material";
import { FlightTakeoff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface FlightSegmentProps {
	time1: string;
	time2: string;
	city1: string;
	city2: string;
	duration: string;
	airline: string;
}

const FlightSegment = ({
	time1,
	time2,
	city1,
	city2,
	duration,
	airline,
}: FlightSegmentProps) => {
	const { t } = useTranslation();
	const theme = useTheme();

	return (
		<Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
			<Box sx={{ minWidth: { xs: "100px", sm: "140px" } }}>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						fontSize: { xs: "1.2rem", sm: "1.5rem" },
						color: theme.palette.text.primary,
					}}
				>
					{time1}
				</Typography>
				<Typography
					sx={{
						color: theme.palette.text.secondary,
						fontSize: { xs: "0.9rem", sm: "1rem" },
						fontWeight: 500,
					}}
				>
					{city1}
				</Typography>
			</Box>

			<Box
				sx={{
					flex: 1,
					mx: { xs: 2, sm: 4 },
					textAlign: "center",
					position: "relative",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 1,
						mb: 1,
					}}
				>
					<Typography
						sx={{
							color: theme.palette.primary.main,
							fontSize: "0.9rem",
							fontWeight: 600,
						}}
					>
						{duration}
					</Typography>
				</Box>
				<Box
					sx={{
						height: 2,
						background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
						my: 1,
						position: "relative",
						"&::before, &::after": {
							content: '""',
							position: "absolute",
							width: 8,
							height: 8,
							borderRadius: "50%",
							backgroundColor: theme.palette.primary.main,
							top: -3,
						},
						"&::before": { left: 0 },
						"&::after": { right: 0 },
					}}
				>
					<FlightTakeoff
						sx={{
							position: "absolute",
							top: -10,
							left: "50%",
							transform: "translateX(-50%)",
							color: theme.palette.primary.main,
							fontSize: "1.2rem",
						}}
					/>
				</Box>
				<Box sx={{ mt: 1 }}>
					<Typography
						sx={{
							color: theme.palette.success.main,
							fontSize: "0.85rem",
							fontWeight: 600,
							mb: 0.5,
						}}
					>
						{t("Direct")}
					</Typography>
					<Typography
						sx={{
							color: theme.palette.text.secondary,
							fontSize: "0.8rem",
							fontWeight: 500,
						}}
					>
						{airline}
					</Typography>
				</Box>
			</Box>

			<Box
				sx={{
					minWidth: { xs: "100px", sm: "140px" },
					textAlign: "right",
				}}
			>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						fontSize: { xs: "1.2rem", sm: "1.5rem" },
						color: theme.palette.text.primary,
					}}
				>
					{time2}
				</Typography>
				<Typography
					sx={{
						color: theme.palette.text.secondary,
						fontSize: { xs: "0.9rem", sm: "1rem" },
						fontWeight: 500,
					}}
				>
					{city2}
				</Typography>
			</Box>
		</Box>
	);
};

export default FlightSegment;
