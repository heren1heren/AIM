import axios from "axios";
import { refreshAccessToken } from "./authService";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});


export const setupInterceptors = (setAccessToken: (token: string | null) => void) => {

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
