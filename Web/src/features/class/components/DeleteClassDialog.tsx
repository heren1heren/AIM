import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

interface DeleteClassDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    className: string; // Optional: Display the name of the class being deleted
}

export default function DeleteClassDialog({
    open,
    onClose,
    onConfirm,
    className,
}: DeleteClassDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the class <strong>{className}</strong>? This action cannot be undone.
                </DialogContentText>
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
}