import { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

interface UserProfile {
    avatar: string; // URL or base64 string for the avatar
    name: string;
    nickname: string;
}

// Mock user profile data
const mockUserProfile: UserProfile = {
    avatar: "https://via.placeholder.com/150", // Placeholder avatar
    name: "John Doe",
    nickname: "Johnny",
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
    const [openDialog, setOpenDialog] = useState(false);
    const [newProfile, setNewProfile] = useState<UserProfile>(mockUserProfile);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        setProfile(newProfile);
        setOpenDialog(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setNewProfile((prev) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                My Profile
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                <Avatar
                    src={profile.avatar}
                    alt={profile.name}
                    sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                    <Typography variant="h6">{profile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Nickname: {profile.nickname}
                    </Typography>
                </Box>
            </Box>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => setOpenDialog(true)}
            >
                Edit Profile
            </Button>

            {/* Edit Profile Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Avatar
                            src={newProfile.avatar}
                            alt={newProfile.name}
                            sx={{ width: 100, height: 100, mr: 3 }}
                        />
                        <Button variant="contained" component="label">
                            Change Avatar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                        </Button>
                    </Box>
                    <TextField
                        label="Name"
                        name="name"
                        value={newProfile.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Nickname"
                        name="nickname"
                        value={newProfile.nickname}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}