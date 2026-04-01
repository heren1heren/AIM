import { useState } from "react";
import { Box, Typography, Avatar, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from "@mui/material";
import { useAuth } from "../../../hooks/AuthContext";
import { useUsers } from "../../../hooks/useUsers";

export default function UserProfilePage() {
    const { userId } = useAuth();
    const { useUserProfile, updateUserProfile } = useUsers();
    const { data: userProfile, isLoading } = useUserProfile(userId);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", bio: "" });

    const handleEditClick = () => {
        if (userProfile) {
            setEditForm({ name: userProfile.name, bio: userProfile.bio || "" });
            setEditDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleSaveChanges = async () => {
        const updatedProfile = new FormData();
        updatedProfile.append("name", editForm.name);
        updatedProfile.append("bio", editForm.bio);

        await updateUserProfile({ id: userId, updatedData: updatedProfile });
        setEditDialogOpen(false);
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("avatar", file);
            await updateUserProfile({ id: userId, updatedData: formData });
        }
    };

    if (isLoading || !userProfile) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {/* User Avatar */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <IconButton component="label">
                        <Avatar
                            sx={{ width: 64, height: 64, mr: 2 }}
                            src={userProfile.avatarUrl || undefined}
                        >
                            {!userProfile.avatarUrl && userProfile.name.charAt(0)} {/* Fallback to initials */}
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {userProfile.name}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* User Details */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                        <strong>Bio:</strong> {userProfile.bio || "No bio set"}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Actions */}
                <Box>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleEditClick}>
                        Edit Profile
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