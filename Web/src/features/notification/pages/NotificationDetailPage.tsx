import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const mockNotifications = [
    { id: 1, text: "New assignment posted" },
    { id: 2, text: "Your grade has been updated" },
    { id: 3, text: "Class schedule changed" },
];

export default function NotificationDetailPage() {
    const { id } = useParams(); // Get the notification ID from the URL
    const notification = mockNotifications.find((n) => n.id === parseInt(id || "0"));

    if (!notification) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    Notification not found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Notification Details
                </Typography>
                <Typography variant="body1">{notification.text}</Typography>
            </Paper>
        </Box>
    );
}