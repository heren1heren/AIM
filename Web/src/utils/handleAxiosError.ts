import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response) {
            // Extract error message from the backend response
            console.error("Axios Error Response:", error.response);
            return error.response.data?.error || error.response.data?.message || "An error occurred.";
        } else if (error.request) {
            // No response received from the server
            console.error("Axios Error Request:", error.request);
            return "No response received from the server.";
        } else {
            // Error occurred while setting up the request
            console.error("Axios Error Message:", error.message);
            return error.message;
        }
    } else {
        // Non-Axios error
        console.error("Unknown Error:", error);
        return "An unknown error occurred.";
    }
};