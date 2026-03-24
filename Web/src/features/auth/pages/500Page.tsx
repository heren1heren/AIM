import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InternalServerErrorPage: React.FC = () => {
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
                500
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Internal Server Error
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Oops! Something went wrong on our end. Please try again later or return to the home page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Back to Home
            </Button>
        </Box>
    );
};

export default InternalServerErrorPage;