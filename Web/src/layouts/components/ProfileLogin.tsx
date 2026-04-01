import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/AuthContext";

export default function ProfileLogin() {
    const navigate = useNavigate();
    const { accessToken, setAccessToken, userId } = useAuth();
    const { useUserProfile } = useUsers();
    const { data: userProfile, isLoading } = useUserProfile(userId); // Replace `1` with the logged-in user's ID

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

            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isLoading) {
        return null;
    }

    if (accessToken && userProfile) {
        // Render profile menu if logged in
        return (
            <>
                <IconButton color="inherit" onClick={openMenu}>
                    <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={userProfile.avatarUrl || undefined} // Use avatarUrl directly from userProfile
                    >
                        {!userProfile.avatarUrl && userProfile?.name?.charAt(0)} {/* Fallback to initials */}
                    </Avatar>
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