import { useState } from "react";
import { Box, Typography, Avatar, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from "@mui/material";
import { useAuth } from "../../../hooks/AuthContext"; // Assuming you have an AuthContext for user data

export default function UserProfilePage() {
    // Mock user data (replace with real data from context or API)
    const { userId } = useAuth(); // Example: Get user data from AuthContext
    const [user, setUser] = useState({
        id: userId || 1,
        name: "John Doe",
        bio: "This is a short bio about the user.",
        joinedDate: "2023-01-15",
        avatar: "", // Avatar URL or base64 string
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false); // State for edit dialog
    const [editForm, setEditForm] = useState({ name: user.name, bio: user.bio }); // State for form fields

    // Open the edit dialog
    const handleEditClick = () => {
        setEditForm({ name: user.name, bio: user.bio }); // Pre-fill the form with current data
        setEditDialogOpen(true);
    };

    // Close the edit dialog
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Save changes to the user profile
    const handleSaveChanges = () => {
        setUser((prev) => ({ ...prev, ...editForm })); // Update user data
        setEditDialogOpen(false); // Close the dialog
    };

    // Handle avatar upload
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                setUser((prev) => ({ ...prev, avatar: reader.result as string })); // Update avatar with base64 string
            };

            reader.readAsDataURL(file); // Convert file to base64 string
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* User Avatar */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <IconButton component="label">
                        <Avatar
                            sx={{ width: 64, height: 64, mr: 2 }}
                            src={user.avatar} // Display uploaded avatar
                        >
                            {!user.avatar && user.name.charAt(0)} {/* Fallback to initials */}
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange} // Handle avatar upload
                        />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {user.name}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* User Details */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                        <strong>Joined:</strong> {new Date(user.joinedDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Bio:</strong> {user.bio}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Actions */}
                <Box>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleEditClick}>
                        Edit Profile
                    </Button>
                    <Button variant="outlined" color="error">
                        Delete Account
                    </Button>
                </Box>
            </Paper>

            {/* Edit Profile Dialog */}
            <Dialog open={editDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Bio"
                        multiline
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}