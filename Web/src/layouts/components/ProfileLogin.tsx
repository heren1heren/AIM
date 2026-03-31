import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { getFileAccessByFileKey } from "../../services/fileService";

export default function ProfileLogin() {
    const navigate = useNavigate();
    const { userProfile, getUserProfileById } = useUsers(); // Fetch userProfile from useUsers

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // State for the avatar URL

    // Fetch the user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                await getUserProfileById(1); // Replace `1` with the logged-in user's ID
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    // Fetch the signed URL for the avatar
    useEffect(() => {
        const fetchAvatarUrl = async () => {
            if (userProfile?.avatarKey) {
                try {
                    console.log("Fetching signed URL for avatarKey:", userProfile.avatarKey); // Debugging
                    const { signedUrl } = await getFileAccessByFileKey(userProfile.avatarKey);
                    console.log("Signed URL fetched:", signedUrl); // Debugging
                    setAvatarUrl(signedUrl); // Set the signed URL for the avatar
                } catch (error) {
                    console.error("Failed to fetch avatar URL:", error);
                }
            } else {
                console.log("No avatarKey found in userProfile."); // Debugging
            }
        };

        fetchAvatarUrl();
    }, [userProfile]); // Run when userProfile changes

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

    if (userProfile) {
        // Render profile menu if logged in
        return (
            <>
                <IconButton color="inherit" onClick={openMenu}>
                    <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={avatarUrl || undefined} // Use the signed URL for the avatar
                    >
                        {!avatarUrl && userProfile?.name?.charAt(0)} {/* Fallback to initials */}
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