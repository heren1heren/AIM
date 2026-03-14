import { Box, Typography, Paper } from "@mui/material";

export default function SystemSettingsPage() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    System Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    This page is under construction. System settings will be available soon.
                </Typography>
            </Paper>
        </Box>
    );
}