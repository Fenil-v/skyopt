import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import CreateBookingForm from "./components/bookings/CreateBooking";
import PublicRoute from "./routing/PublicRoute";
import PrivateRoute from "./routing/PrivateRoute";
import UserProfile from "./pages/UserProfile";
import ViewBookings from "./components/bookings/ViewBookings";
import FlightManagement from "./components/flights/FlightManagement";
import PaymentSuccessPage from "./components/payment-gateway/PaymentSuccess";
import { I18nextProvider } from "react-i18next";
import { Suspense, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import i18n from "./i18n";
import "./i18n";
import { useLocation, useNavigate } from "react-router-dom";

const SUPPORTED_LANGUAGES = ["en", "hi", "es", "gu"];

function LoadingFallback() {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
		>
			<CircularProgress />
		</Box>
	);
}

function LanguageRouter({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathSegments = location.pathname.split("/");
		const langCode = pathSegments[1];

		// If no language code in URL or invalid language code
		if (!langCode || !SUPPORTED_LANGUAGES.includes(langCode)) {
			const defaultLang = i18n.language || "en";
			const newPath = `/${defaultLang}${location.pathname}`;
			navigate(newPath, { replace: true });
		} else {
			// Set language based on URL
			i18n.changeLanguage(langCode);
		}
	}, [location, navigate]);

	return <>{children}</>;
}

function App() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<I18nextProvider i18n={i18n}>
				<LanguageRouter>
					<Box
						sx={{
							minHeight: "100vh",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Routes>
							{/* Public Routes */}
							<Route path="/:lang">
								<Route
									path="login"
									element={
										<PublicRoute>
											<Login />
										</PublicRoute>
									}
								/>
								<Route
									path="sign-up"
									element={
										<PublicRoute>
											<SignUp />
										</PublicRoute>
									}
								/>
								{/* Private Routes */}
								<Route element={<PrivateRoute />}>
									<Route path="" element={<Home />} />
									<Route
										path="profile"
										element={<UserProfile />}
									/>
									<Route
										path="createBookings"
										element={<CreateBookingForm />}
									/>
									<Route
										path="manage-flight"
										element={<FlightManagement />}
									/>
									<Route
										path="bookings"
										element={<ViewBookings />}
									/>
									<Route
										path="payment-success"
										element={<PaymentSuccessPage />}
									/>
								</Route>
							</Route>
							{/* Redirect root to default language */}
							<Route path="*" element={<LoadingFallback />} />
						</Routes>
					</Box>
				</LanguageRouter>
			</I18nextProvider>
		</Suspense>
	);
}

export default App;
