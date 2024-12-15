export const getToken = (): string => {
	const tokenKey = import.meta.env.VITE_APP_AUTH;
	return localStorage.getItem(tokenKey) || "";
};

export function setupAxios(axios: any) {
	axios.defaults.headers.Accept = "application/json";
	axios.interceptors.request.use(
		(config: { headers: { Authorization: string } }) => {
			const auth = getToken();
			if (auth) {
				config.headers.Authorization = `Bearer ${auth}`;
			}

			return config;
		},
		(err: any) => Promise.reject(err)
	);
	// Add a response interceptor
	axios.interceptors.response.use(
		(response: any) => {
			return response;
		},
		(err: any) => {
			if (err?.response?.status === 401) {
				localStorage.clear();
				window.location.href = "/login";
			}
			return Promise.reject(err);
		}
	);
}
