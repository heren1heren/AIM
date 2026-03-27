import axios from "axios";

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post("/auth/refresh", {}, { withCredentials: true }); // Ensure cookies are sent
        return response.data.accessToken; // Return the new accessToken
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw error;
    }
};