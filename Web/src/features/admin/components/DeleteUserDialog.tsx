import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface DeleteUserDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this user?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;