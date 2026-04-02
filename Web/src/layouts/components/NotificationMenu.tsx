import { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemText, Button, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../hooks/AuthContext"; // To get the current user's ID
import { formatDistanceToNow } from "date-fns"; // Import date-fns

export default function NotificationMenu() {
    const { useCurrentUserNotifications, markNotificationAsRead } = useNotifications();
    const { userId } = useAuth();
    const { data: notifications, isLoading } = useCurrentUserNotifications(userId);

    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const [showAll, setShowAll] = useState(false); // State to toggle "More" notifications
    const navigate = useNavigate();

    // Open notification menu
    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    // Close notification menu
    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    // Handle notification click
    const handleNotificationClick = async (id: number) => {
        try {
            await markNotificationAsRead({ id, userId }); // Mark as read
            navigate(`/notifications/${id}`); // Navigate to the notification details
            handleNotifClose();
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    // Truncate long messages
    const truncateMessage = (message: string, maxLength: number) => {
        return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
    };

    // Limit notifications to 5 initially
    const displayedNotifications = showAll ? notifications : notifications?.slice(0, 5);

    //currently not working
    const unreadNotifications = notifications?.filter((notif) => {
        // Ensure read_users is an array and check if userId is not in it
        return Array.isArray(notif?.read_users) && !notif.read_users.some((user) => user.id === userId);
    });

    return (
        <>
            {/* Notification Icon */}
            <IconButton color="inherit" onClick={handleNotifClick}>
                <Badge
                    badgeContent={unreadNotifications?.length || 0}
                    color="error"
                    invisible={unreadNotifications?.length === 0} // Hide the red dot if no unread notifications
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {isLoading ? (
                    <MenuItem>Loading...</MenuItem>
                ) : notifications && notifications.length > 0 ? (
                    [
                        <List key="notification-list">
                            {displayedNotifications?.map((notif) => (
                                <ListItem
                                    key={notif.id}
                                    button
                                    onClick={() => handleNotificationClick(notif.id)}
                                    sx={{
                                        border: "1px solid #ddd", // Add a light border
                                        borderRadius: "8px", // Optional: rounded corners
                                        padding: "16px", // Add padding
                                        marginBottom: "8px", // Add spacing between items
                                        position: "relative", // For positioning the status text
                                    }}
                                >
                                    {/* Status (Unread/Read) */}
                                    <Typography
                                        variant="caption"
                                        color={
                                            notif.read_users?.some((user) => user.id === userId) // Check if userId exists in read_users
                                                ? "textSecondary" // Gray for "Read"
                                                : "error" // Red for "Unread"
                                        }
                                        sx={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "16px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {notif.read_users?.some((user) => user.id === userId) ? "Read" : "Unread"}
                                    </Typography>

                                    <ListItemText
                                        primary={notif.title}
                                        secondary={
                                            <>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    component="span"
                                                    sx={{
                                                        display: "block", // Ensure it takes up its own line
                                                        marginBottom: "16px", // Add spacing below the message
                                                    }}
                                                >
                                                    {truncateMessage(notif.message, 50)}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    component="span"
                                                    sx={{
                                                        position: "absolute", // Position it at the bottom-right
                                                        bottom: "8px", // Adjusted to ensure it's further down
                                                        right: "16px",
                                                        fontSize: "0.75rem", // Adjust font size if needed
                                                    }}
                                                >
                                                    {`Posted ${formatDistanceToNow(new Date(notif.created_at), {
                                                        addSuffix: true,
                                                    })}`}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>,
                        notifications.length > 5 && (
                            <MenuItem key="more-button">
                                <Button
                                    fullWidth
                                    onClick={() => setShowAll((prev) => !prev)}
                                >
                                    {showAll ? "Show Less" : "More"}
                                </Button>
                            </MenuItem>
                        ),
                    ]
                ) : (
                    <MenuItem>No new notifications</MenuItem>
                )}
            </Menu>
        </>
    );
}