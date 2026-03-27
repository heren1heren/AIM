import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Assuming you have useAuth for authentication context

export default function ProfileLogin() {
    const { accessToken, setAccessToken } = useAuth(); // Check if the user is logged in
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            // Call the backend logout endpoint to clear the refresh token in cookies
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include", // Include cookies in the request
            });

            // Clear the access token in the AuthContext
            setAccessToken(null);

            // Redirect to the login page
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (accessToken) {
        // Render profile menu if logged in
        return (
            <>
                <IconButton color="inherit" onClick={openMenu}>
                    <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            navigate("/profile"); // Navigate to the user profile page
                        }}
                    >
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            handleLogout();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </>
        );
    }

    // Render login button if not logged in
    return (
        <Button color="inherit" onClick={() => navigate("/auth/login")}>
            Login
        </Button>
    );
}