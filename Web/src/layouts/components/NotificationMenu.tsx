import { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

export default function NotificationMenu() {
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate(); // Hook to navigate between pages

    // Example notifications with IDs
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New assignment posted" },
        { id: 2, text: "Your grade has been updated" },
        { id: 3, text: "Class schedule changed" },
    ]);

    // Open notification menu
    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    // Close notification menu
    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    // Handle notification click
    const handleNotificationClick = (id: number) => {
        navigate(`/notifications/${id}`); // Navigate to the notification detail page
        handleNotifClose(); // Close the menu after clicking
    };

    return (
        <>
            {/* Notification Icon */}
            <IconButton color="inherit" onClick={handleNotifClick}>
                <Badge badgeContent={notifications.length} color="error">
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
                {notifications.length > 0 ? (
                    <List>
                        {notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                button
                                onClick={() => handleNotificationClick(notif.id)} // Navigate on click
                            >
                                <ListItemText primary={notif.text} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <MenuItem>No new notifications</MenuItem>
                )}
            </Menu>
        </>
    );
}