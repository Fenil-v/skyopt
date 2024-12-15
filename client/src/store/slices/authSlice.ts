import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	firstName: string;
	lastName: string;
}

interface AuthState {
	token: string | null;
	isLoggedIn: boolean;
	currentUser: User | null;
}

const AUTH_KEY = import.meta.env.VITE_APP_AUTH;

const initialState: AuthState = {
	token: localStorage.getItem(AUTH_KEY) || null,
	isLoggedIn: !!localStorage.getItem(AUTH_KEY),
	currentUser: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
			state.isLoggedIn = true;
			localStorage.setItem(AUTH_KEY, action.payload);
		},
		clearAuthToken: (state) => {
			state.token = null;
			state.isLoggedIn = false;
			localStorage.removeItem(AUTH_KEY);
		},
		setCurrentUser: (state, action: PayloadAction<User>) => {
			state.currentUser = action.payload;
		},
		clearCurrentUser: (state) => {
			state.currentUser = null;
		},
	},
});

export const {
	setAuthToken,
	clearAuthToken,
	setCurrentUser,
	clearCurrentUser,
} = authSlice.actions;
export default authSlice.reducer;
