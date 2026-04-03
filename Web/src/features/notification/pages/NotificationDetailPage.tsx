import { useParams } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, List, ListItem, Link } from "@mui/material";
import { useNotifications } from "../../../hooks/useNotifications";

export default function NotificationDetailPage() {
    const { notificationId } = useParams(); // Get the notification ID from the URL
    const { useNotificationById } = useNotifications(); // Access the hook
    const { data: notification, isLoading, isError } = useNotificationById(parseInt(notificationId || "0"));

    // Format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !notification) {
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
                <Typography variant="h4" fontWeight={600} gutterBottom sx={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                    {notification.title}
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ wordWrap: "break-word", whiteSpace: "normal" }}
                >
                    {notification.message}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: {formatDate(notification.created_at)}
                </Typography>

                {/* Display Files */}
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Attached Files:
                </Typography>
                {notification.files && notification.files.length > 0 ? (
                    <List>
                        {notification.files.map((file) => (
                            <ListItem key={file.id}>
                                <Link
                                    href={file.signedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ wordWrap: "break-word" }}
                                >
                                    {file.filename}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        0 files
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}