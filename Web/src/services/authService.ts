import axios from "axios";

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post("/auth/refresh", {}, { withCredentials: true }); 
        return response.data.accessToken;
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw error;
    }
};