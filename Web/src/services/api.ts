import axios from "axios";
import { refreshAccessToken } from "./authService";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});


export const setupInterceptors = (setAccessToken: (token: string | null) => void) => {

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]"); // Retrieve roles from localStorage

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (roles.length > 0) {
            config.headers["X-Roles"] = roles.join(","); // Attach roles as a custom header
        }

        return config;
    });


    api.interceptors.response.use(
        (response) => response, // Pass through successful responses
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Prevent infinite retry loops

                try {
                    const newAccessToken = await refreshAccessToken();

                    setAccessToken(newAccessToken);

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    // Reattach roles after refreshing the token
                    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
                    if (roles.length > 0) {
                        originalRequest.headers["X-Roles"] = roles.join(",");
                    }

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);


                    setAccessToken(null); // Clear the token in AuthContext
                    window.location.href = "/auth/login"; // Redirect to login page
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

export default api;
