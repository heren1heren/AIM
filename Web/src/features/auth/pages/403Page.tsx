import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
    const navigate = useNavigate();


    const handleGoHome = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                textAlign: "center",
                p: 3,
            }}
        >
            <Typography variant="h1" fontWeight="bold" sx={{ mb: 2 }}>
                403
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Forbidden
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                You do not have permission to access this page. Please go back or return to the home page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome} sx={{ mb: 2 }}>
                Go to Home
            </Button>

        </Box>
    );
}