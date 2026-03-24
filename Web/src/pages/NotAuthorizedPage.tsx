import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotAuthorizedPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
            }}
        >
            <Typography variant="h4" fontWeight={600} gutterBottom>
                403 - Not Authorized
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You do not have permission to access this page.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
            >
                Go to Home
            </Button>
        </Box>
    );
}