import { Box, Typography, Paper } from "@mui/material";

export default function AdminDashboard() {
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
                    Welcome, Admin user 1!
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    You are now logged in. Use the navigation bar to access your classes,
                    assignments, and announcements.
                </Typography>
            </Paper>
        </Box>
    );
}
