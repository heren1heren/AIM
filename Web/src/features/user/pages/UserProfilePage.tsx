import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from "@mui/material";
import { useAuth } from "../../../hooks/AuthContext";
import { useUsers } from "../../../hooks/useUsers";
import { useFile } from "../../../hooks/useFile";

export default function UserProfilePage() {
    const { userId } = useAuth();
    const { userProfile, getUserProfileById, updateUserProfile } = useUsers();
    const { handleUploadAvatarFile, fetchFileAccessByFileKey } = useFile();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", bio: "" });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            const profile = await getUserProfileById(userId);
            console.log("Fetched userProfile:", profile);
            setLoading(false);
        };

        fetchUserProfile();
    }, []);

    // Fetch the signed URL for the avatar
    useEffect(() => {
        const fetchAvatarUrl = async () => {
            if (userProfile?.avatarKey) {
                try {
                    console.log("Fetching signed URL for fileKey:", userProfile.avatarKey); // Debugging
                    const { signedUrl } = await fetchFileAccessByFileKey(userProfile.avatarKey);
                    console.log("Signed URL fetched:", signedUrl); // Debugging
                    setAvatarUrl(signedUrl);
                } catch (error) {
                    console.error("Error in fetchFileAccessByFileKey:", error);
                }
            }
        };

        fetchAvatarUrl();
    }, [userProfile, fetchFileAccessByFileKey]);

    // Open the edit dialog
    const handleEditClick = () => {
        if (userProfile) {
            setEditForm({ name: userProfile.name, bio: userProfile.bio || "" });
            setEditDialogOpen(true);
        }
    };

    // Close the edit dialog
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Save changes to the user profile
    const handleSaveChanges = async () => {
        const updatedProfile = { name: editForm.name, bio: editForm.bio };
        await updateUserProfile(userId, updatedProfile);
        setEditDialogOpen(false);
    };

    // Handle avatar upload
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0]; // Browser File object

            try {
                const uploadedAvatar = await handleUploadAvatarFile(file); // Upload the avatar
                await updateUserProfile(userId, { avatarKey: uploadedAvatar.key }); // Update the avatarKey in the user profile
                const { signedUrl } = await fetchFileAccessByFileKey(uploadedAvatar.key); // Fetch the signed URL for the new avatar
                setAvatarUrl(signedUrl); // Update the avatar URL in the state
            } catch (error) {
                console.error("Failed to upload avatar:", error);
            }
        }
    };

    if (loading || !userProfile) {
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
                            src={avatarUrl || undefined}
                        >
                            {!avatarUrl && userProfile.name.charAt(0)} {/* Fallback to initials */}
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