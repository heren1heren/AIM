import { useState } from "react";
import { IconButton, Badge, Menu, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationMenu() {
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState([
        "New assignment posted",
        "Your grade has been updated",
        "Class schedule changed",
    ]); // Example notifications

    // Open notification menu
    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchorEl(event.currentTarget);
    };

    // Close notification menu
    const handleNotifClose = () => {
        setNotifAnchorEl(null);
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
                        {notifications.map((notif, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText primary={notif} />
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