import React, { useState, useEffect, useCallback } from "react";
import { eligibleCoupons } from "../services/_requests";
import { Typography, Snackbar } from "@mui/material";
import {
	StyledModal,
	ModalContent,
	CloseButton,
	CouponBox,
	CopyButton,
	IconWrapper,
	StyledOfferIcon,
	LoadingBox,
} from "../styles/CoupenComponent";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { CouponCodeComponentProps } from "../models/_models";

const CouponCodeComponent: React.FC<CouponCodeComponentProps> = ({ token }) => {
	const [loading, setLoading] = useState(true);
	const [couponAvailable, setCouponAvailable] = useState(false);
	const [couponCode, setCouponCode] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [open, setOpen] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [couponCopied, setCouponCopied] = useState(
		!!localStorage.getItem("couponCopied")
	);
	const [pastedContent, setPastedContent] = useState<string>("");

	// Check if Clipboard API is supported
	const isClipboardSupported = navigator.clipboard && window.isSecureContext;

	useEffect(() => {
		const fetchCouponData = async () => {
			if (couponCopied) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const response = await eligibleCoupons(token);

				if (response.status === 200) {
					const { coupon, couponCode, message } = response.data;
					setCouponAvailable(coupon);
					setCouponCode(couponCode);
					setMessage(message);

					if (coupon) {
						setOpen(true);
					}
				} else {
					setOpen(false);
				}
			} catch (error) {
				setMessage("Failed to fetch coupon data. Please try again.");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCouponData();
	}, [token, couponCopied]);

	const handleClose = useCallback(() => setOpen(false), []);

	const handleCopy = useCallback(async () => {
		if (!couponCode) return;

		try {
			if (isClipboardSupported) {
				// Write plain text
				await navigator.clipboard.writeText(couponCode);

				// Write rich formatted content
				const clipboardItem = new ClipboardItem({
					"text/plain": new Blob([couponCode], {
						type: "text/plain",
					}),
					"text/html": new Blob(
						[
							`<div style="font-family: Arial; color: #00875a; font-weight: bold; 
             padding: 8px; border: 1px dashed #00875a; border-radius: 4px;">
              ${couponCode}
            </div>`,
						],
						{ type: "text/html" }
					),
				});

				await navigator.clipboard.write([clipboardItem]);
				setMessage("Coupon code copied successfully!");
			} else {
				// Fallback for browsers without Clipboard API support
				const textArea = document.createElement("textarea");
				textArea.value = couponCode;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
				setMessage("Coupon code copied successfully!");
			}
			setSnackbarOpen(true);
			setCouponCopied(true);
			localStorage.setItem("couponCopied", "true");
		} catch (err) {
			console.error("Failed to copy:", err);
			setMessage("Failed to copy coupon code. Please try again.");
			setSnackbarOpen(true);
		}
	}, [couponCode, isClipboardSupported]);

	const handlePaste = useCallback(async () => {
		try {
			if (isClipboardSupported) {
				const clipboardItems = await navigator.clipboard.read();
				for (const item of clipboardItems) {
					if (item.types.includes("text/plain")) {
						const blob = await item.getType("text/plain");
						const text = await blob.text();
						setPastedContent(text);
						setMessage(
							text === couponCode
								? "Valid coupon code pasted!"
								: "Invalid coupon code"
						);
						setSnackbarOpen(true);
					}
				}
			} else {
				setMessage("Clipboard API not supported in this browser");
				setSnackbarOpen(true);
			}
		} catch (err) {
			console.error("Failed to read clipboard:", err);
			setMessage("Failed to read from clipboard. Please try again.");
			setSnackbarOpen(true);
		}
	}, [couponCode]);

	const handleSnackbarClose = useCallback(
		(_e: React.SyntheticEvent | Event, reason?: string) => {
			if (reason !== "clickaway") {
				setSnackbarOpen(false);
			}
		},
		[]
	);

	if (loading) {
		return (
			<LoadingBox>
				<Typography color="text.secondary">Loading...</Typography>
			</LoadingBox>
		);
	}

	return (
		<>
			<StyledModal
				open={open}
				onClose={handleClose}
				aria-labelledby="coupon-modal-title"
			>
				<ModalContent>
					<CloseButton onClick={handleClose} size="small">
						<CloseIcon />
					</CloseButton>

					<IconWrapper>
						<StyledOfferIcon />
					</IconWrapper>

					<Typography
						id="coupon-modal-title"
						variant="h4"
						align="center"
						gutterBottom
						sx={{ fontWeight: 700, marginBottom: "8px" }}
					>
						Congratulations!
					</Typography>

					{couponAvailable ? (
						<>
							<Typography
								align="center"
								sx={{
									fontSize: "18px",
									color: "#00875a",
									marginBottom: "16px",
								}}
							>
								You are eligible for an exclusive coupon!
							</Typography>

							<CouponBox>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 700,
										letterSpacing: "1px",
									}}
								>
									{couponCode}
								</Typography>
							</CouponBox>

							<CopyButton
								variant="contained"
								startIcon={<ContentCopyIcon />}
								onClick={handleCopy}
								fullWidth
								disabled={couponCopied}
							>
								{couponCopied
									? "Coupon Already Copied"
									: "Click to Copy Code"}
							</CopyButton>

							{isClipboardSupported && (
								<CopyButton
									variant="outlined"
									startIcon={<ContentPasteIcon />}
									onClick={handlePaste}
									fullWidth
									sx={{ marginTop: 2 }}
								>
									Paste Coupon Code
								</CopyButton>
							)}

							{pastedContent && (
								<Typography
									sx={{
										marginTop: 2,
										color:
											pastedContent === couponCode
												? "#00875a"
												: "error.main",
									}}
								>
									Pasted code: {pastedContent}
								</Typography>
							)}
						</>
					) : (
						<Typography color="error" align="center">
							{message}
						</Typography>
					)}
				</ModalContent>
			</StyledModal>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleSnackbarClose}
				message={message}
				sx={{
					"& .MuiSnackbarContent-root": {
						backgroundColor: "#4285f4",
						color: "white",
						borderRadius: "8px",
					},
				}}
			/>
		</>
	);
};

export default CouponCodeComponent;
