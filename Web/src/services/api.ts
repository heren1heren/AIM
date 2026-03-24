import axios from "axios";
import { refreshAccessToken } from "./auth.service";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true, // Include cookies in requests
});

// Function to initialize Axios interceptors with AuthContext
export const setupInterceptors = (setAccessToken: (token: string | null) => void) => {
    // Request Interceptor: Attach the access token to every request
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response Interceptor: Handle token refresh and errors
    api.interceptors.response.use(
        (response) => response, // Pass through successful responses
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Prevent infinite retry loops

                try {
                    // Refresh the access token
                    const newAccessToken = await refreshAccessToken();

                    // Update the token in AuthContext
                    setAccessToken(newAccessToken);

                    // Retry the original request with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);

                    // Clear tokens and redirect to login
                    setAccessToken(null); // Clear the token in AuthContext
                    window.location.href = "/auth/login"; // Redirect to login page
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error); // Reject other errors
        }
    );
};

export default api;
