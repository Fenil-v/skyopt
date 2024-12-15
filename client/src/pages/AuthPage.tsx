import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "../components/auth/Login";

const AuthPage = () => {
	return (
		<Routes>
			<Route>
				<Route path="/*" element={<Navigate to="/login" />} />
				<Route path="login" element={<Login />} />
			</Route>
		</Routes>
	);
};

export { AuthPage };
