import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileLogin from "./ProfileLogin";
import NotificationMenu from "./NotificationMenu"; // Import NotificationMenu
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to check authentication

interface NavBarProps {
    onMenuClick: () => void; // Function to toggle the drawer
}

export default function NavBar({ onMenuClick }: NavBarProps) {
    const { accessToken, roles } = useAuth(); // Get accessToken and roles from AuthContext

    // Determine the title based on roles
    let title = "AIM Portal"; // Default title
    if (accessToken) {
        if (roles?.includes("student")) {
            title = "Student Portal";
        } else if (roles?.includes("admin")) {
            title = "Admin Portal";
        } else if (roles?.includes("teacher")) {
            title = "Teacher Portal";
        }
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* Hamburger menu - Only show if user is authenticated */}
                {accessToken && (
                    <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Title */}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>

                {/* Notification Menu - Only show if user is authenticated and not an admin */}
                {accessToken && !roles?.includes("admin") && <NotificationMenu />}

                {/* Profile or Login */}
                <ProfileLogin />
            </Toolbar>
        </AppBar>
    );
}