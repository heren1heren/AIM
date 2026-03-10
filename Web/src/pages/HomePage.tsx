import { Typography, Box } from "@mui/material";

export default function HomePage() {
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
