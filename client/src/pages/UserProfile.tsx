import React, { useEffect, useState } from "react";
import { fetchUserData, editUser } from "../services/_requests";
import {
	Typography,
	CircularProgress,
	Box,
	Avatar,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	Container,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	Alert,
} from "@mui/material";
import { Notifications, AccountCircle, Edit } from "@mui/icons-material";
import { deepPurple } from "@mui/material/colors";
import NavBar from "../components/Navbar";
import { MenuItem } from "@mui/material";
import { logout } from "../services/_requests";
import ToastAlert from "../components/ToastAlert";
import { getToken } from "../components/Helpers";

const UserProfile: React.FC = () => {
	const token = getToken();
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [editedData, setEditedData] = useState<any>({});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});
	const handleLogout = async () => {
		try {
			const { status } = await logout(token);
			if (status === 200) {
				localStorage.clear();
				window.location.href = "/login";
			}
		} catch (err) {
			setSnackbar({
				open: true,
				message: "Failed to logout",
				severity: "error",
			});
		}
	};

	useEffect(() => {
		const getUserData = async () => {
			try {
				const data = await fetchUserData();
				setUserData(data.data);
				setEditedData(data.data);
			} catch (err) {
				setError("Failed to fetch user data");
			} finally {
				setLoading(false);
			}
		};

		getUserData();
	}, []);

	const handleEditClick = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setEditedData(userData);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedData({
			...editedData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = async () => {
		try {
			const response = await editUser(editedData);
			setUserData(response.data);
			await ToastAlert({
				icon: "success",
				title: "Profile updated successfully!",
			});
			setOpenDialog(false);
		} catch (err) {
			await ToastAlert({
				icon: "error",
				title: "Failed to update profile",
			});
		}
	};

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	return (
		<>
			<NavBar userName={userData} />
			<Container maxWidth="lg" sx={{ display: "flex", gap: 4, py: 4 }}>
				<Box sx={{ width: "30%" }}>
					<Box sx={{ textAlign: "center", mb: 4 }}>
						<Avatar
							src={userData?.avatar}
							sx={{
								width: 60,
								height: 60,
								margin: "0 auto",
								mb: 2,
								bgcolor: deepPurple[500],
							}}
						>
							{userData?.username?.charAt(0).toUpperCase()}
						</Avatar>
						<Typography variant="h5">Hi there!</Typography>
						<Typography color="textSecondary" sx={{ mb: 2 }}>
							{userData?.firstName} {userData?.lastName}
						</Typography>
					</Box>

					<List>
						<ListItem sx={{ py: 2 }}>
							<ListItemIcon>
								<Notifications />
							</ListItemIcon>
							<ListItemText primary="Your bookings" />
						</ListItem>

						<ListItem sx={{ py: 2 }}>
							<ListItemIcon>
								<AccountCircle />
							</ListItemIcon>
							<ListItemText primary="Account" />
						</ListItem>
					</List>

					<Button
						fullWidth
						variant="contained"
						onClick={handleLogout}
						sx={{
							bgcolor: "#e9eef2",
							color: "black",
							"&:hover": { bgcolor: "#d1d7dc" },
							textTransform: "none",
							py: 1.5,
						}}
					>
						Log out
					</Button>
				</Box>

				<Box sx={{ width: "70%" }}>
					<Box sx={{ py: 4 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								mb: 4,
							}}
						>
							<div>
								<Typography
									variant="h4"
									sx={{ fontWeight: "bold", mb: 1 }}
								>
									Profile
								</Typography>
								<Typography
									variant="subtitle1"
									sx={{ color: "text.secondary" }}
								>
									Basic info, for a faster booking experience
								</Typography>
							</div>
							<Button
								variant="contained"
								startIcon={<Edit />}
								onClick={handleEditClick}
							>
								Edit Profile
							</Button>
						</Box>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 3,
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									borderBottom: "1px solid #e0e0e0",
									pb: 2,
								}}
							>
								<Typography color="text.secondary">
									NAME
								</Typography>
								<Typography>
									{userData?.firstName} {userData?.lastName}
								</Typography>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									borderBottom: "1px solid #e0e0e0",
									pb: 2,
								}}
							>
								<Typography color="text.secondary">
									Email
								</Typography>
								<Typography>{userData?.email}</Typography>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									borderBottom: "1px solid #e0e0e0",
									pb: 2,
								}}
							>
								<Typography color="text.secondary">
									BIRTHDAY
								</Typography>
								<Typography>
									{new Date(
										userData?.dateOfBirth
									).toLocaleDateString("en-GB")}
								</Typography>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									borderBottom: "1px solid #e0e0e0",
									pb: 2,
								}}
							>
								<Typography color="text.secondary">
									GENDER
								</Typography>
								<Typography>
									{userData?.gender?.toUpperCase()}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>

			<Dialog
				open={openDialog}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
							mt: 2,
						}}
					>
						<TextField
							label="First Name"
							name="firstName"
							value={editedData?.firstName || ""}
							onChange={handleInputChange}
							fullWidth
						/>
						<TextField
							label="Last Name"
							name="lastName"
							value={editedData?.lastName || ""}
							onChange={handleInputChange}
							fullWidth
						/>
						<TextField
							label="Email"
							name="email"
							value={editedData?.email || ""}
							onChange={handleInputChange}
							fullWidth
							type="email"
						/>
						<TextField
							label="Date of Birth"
							name="dateOfBirth"
							value={editedData?.dateOfBirth || ""}
							onChange={handleInputChange}
							fullWidth
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							select
							label="Gender"
							name="gender"
							value={editedData?.gender || ""}
							onChange={handleInputChange}
							fullWidth
						>
							<MenuItem value="m">Male</MenuItem>
							<MenuItem value="f">Female</MenuItem>
						</TextField>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSave} variant="contained">
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert
					severity={snackbar.severity}
					onClose={() => setSnackbar({ ...snackbar, open: false })}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default UserProfile;
