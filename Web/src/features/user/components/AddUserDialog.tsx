import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    name: string;
    setName: (value: string) => void;
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    role: string;
    setRole: (value: string) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
    open,
    onClose,
    onSubmit,
    name,
    setName,
    username,
    setUsername,
    password,
    setPassword,
    role,
    setRole,
}) => {
    const isFormValid = name && username && password && role;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Username *"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Role *"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    select
                    fullWidth
                    margin="dense"
                >
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="primary" disabled={!isFormValid}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserDialog;