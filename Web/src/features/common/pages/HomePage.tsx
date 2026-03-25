import { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";

export default function HomePage() {
    const { accessToken, roles } = useAuth(); // Get accessToken and roles from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect based on user roles
        if (accessToken) {
            if (roles?.includes("admin")) {
                navigate("/admin/home");
            } else if (roles?.includes("teacher")) {
                navigate("/teacher/home");
            } else if (roles?.includes("student")) {
                navigate("/student/home");
            }
        }
    }, [accessToken, roles, navigate]);

    // If no accessToken, show the welcome message
    return (
        <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Welcome to the AIM School Portal
            </Typography>

            <Typography variant="body1" color="text.secondary">
                Log in to use this application.
            </Typography>
        </Box>
    );
}
