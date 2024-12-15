import { Box, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
	const { t } = useTranslation();

	return (
		<Box
			component="footer"
			sx={{
				bgcolor: "#1976d2",
				py: 6,
				borderTop: "1px solid",
				borderColor: "divider",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 600,
							mb: 2,
							color: "white",
						}}
					>
						SkyOpt
					</Typography>
					<Typography
						variant="h6"
						sx={{
							color: "white",
							mb: 3,
						}}
					>
						{t(
							"Your trusted partner for finding the best flight deals worldwide"
						)}
					</Typography>
				</Box>
				<Box
					sx={{
						mt: 6,
						pt: 2,
						borderTop: "1px solid",
						borderColor: "rgba(255, 255, 255, 0.3)",
					}}
				>
					<Typography
						variant="body1"
						sx={{
							color: "white",
						}}
					>
						©️ {new Date().getFullYear()} SkyOpt.{" "}
						{t("All rights reserved")}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
