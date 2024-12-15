import { IconButton, Menu, MenuItem, Typography, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const languages = [
	{ code: "en", label: "English" },
	{ code: "hi", label: "हिंदी" },
	{ code: "es", label: "Español" },
	{ code: "gu", label: "ગુજરાતી" },
];

const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
		document.dir = i18n.dir();
		handleClose();
	};

	return (
		<>
			<Tooltip title={t("Select Language")}>
				<IconButton onClick={handleOpen} sx={{ color: "white" }}>
					<LanguageIcon />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				sx={{ mt: "45px" }}
			>
				{languages.map((lang) => (
					<MenuItem
						key={lang.code}
						onClick={() => changeLanguage(lang.code)}
						selected={i18n.language === lang.code}
					>
						<Typography textAlign="center">{lang.label}</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default LanguageSwitcher;
