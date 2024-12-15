import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { LoginPayload } from "../models/_models";
import { login } from "../services/_requests";
import ToastAlert from "../components/ToastAlert";
import Swal from "sweetalert2";
import Loader from "../components/PageLoader";
import { useNavigate } from "react-router-dom";

// Validation Schema
const validationSchema = Yup.object({
	email: Yup.string()
		.email("Invalid email format")
		.required("Email is required"),
	password: Yup.string()
		.min(4, "Password must be at least 4 characters")
		.required("Password is required"),
});

const initialValues: LoginPayload = {
	email: "",
	password: "",
	rememberMe: false,
};

const Login: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const theme = useTheme();
	const navigate = useNavigate();

	const showAlertMessage = async (message: string, isError: boolean) => {
		if (isError) {
			Swal.fire({
				toast: true,
				title: message,
				icon: "error",
				width: "25rem",
				position: "top",
				timer: 2500,
				timerProgressBar: true,
				showConfirmButton: false,
				showCancelButton: false,
				didOpen: (toast) => {
					toast.addEventListener("mouseenter", Swal.stopTimer);
					toast.addEventListener("mouseleave", Swal.resumeTimer);
				},
			});
		} else {
			await ToastAlert({
				icon: "success",
				title: message,
				timer: 2500,
			});
		}
	};

	const handleSubmit = async (values: LoginPayload, { resetForm }: any) => {
		setIsLoading(true);
		try {
			const { status } = await login(values);
			if (status === 200) {
				resetForm();
				navigate("/");
				// Show toast after navigation
				setTimeout(() => {
					showAlertMessage("Login Successful!", false);
				}, 100);
			}
		} catch (error: any) {
			showAlertMessage("Invalid email or password", true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Container maxWidth="xs">
				<Box
					sx={{
						mt: 8,
						px: 4,
						py: 5,
						borderRadius: "12px",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						backgroundColor: "#ffffff",
					}}
				>
					<Typography
						variant="h4"
						sx={{
							textAlign: "center",
							mb: 4,
							fontWeight: 700,
							color: theme.palette.primary.main,
						}}
					>
						Sign in
					</Typography>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({ errors, touched }) => (
							<Form>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Field
											as={TextField}
											fullWidth
											label="Email"
											name="email"
											type="email"
											variant="outlined"
											error={
												touched.email &&
												Boolean(errors.email)
											}
											helperText={
												<ErrorMessage name="email" />
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Field
											as={TextField}
											fullWidth
											label="Password"
											name="password"
											type="password"
											variant="outlined"
											error={
												touched.password &&
												Boolean(errors.password)
											}
											helperText={
												<ErrorMessage name="password" />
											}
										/>
									</Grid>
									<Grid item xs={12}>
										<Button
											type="submit"
											fullWidth
											variant="contained"
											sx={{
												py: 1.5,
												backgroundColor:
													theme.palette.primary.main,
												fontWeight: 600,
												"&:hover": {
													backgroundColor:
														theme.palette.primary
															.dark,
												},
											}}
										>
											Sign in
										</Button>
									</Grid>
									<Grid item xs={12}>
										<Typography
											variant="body2"
											sx={{
												textAlign: "center",
												color: theme.palette.text
													.secondary,
												mt: 1,
											}}
										>
											Don’t have an account?{" "}
											<Typography
												component="a"
												href="/sign-up"
												sx={{
													color: theme.palette.primary
														.main,
													textDecoration: "none",
													fontWeight: 500,
												}}
											>
												Sign up
											</Typography>
										</Typography>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Box>
			</Container>
			{!isLoading && <Loader isLoading={false} />}
		</React.Fragment>
	);
};

export default Login;
