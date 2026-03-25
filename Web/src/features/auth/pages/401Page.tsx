import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    const handleGoToHome = () => {
        navigate("/");
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
                401
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Unauthorized Access
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                You do not have permission to view this page. Please go back or log in with the appropriate credentials.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoToHome} sx={{ mb: 2 }}>
                Go To Home
            </Button>

        </Box>
    );
}