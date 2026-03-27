import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from "@mui/material";

export default function AddNotificationDialog({
    open,
    onClose,
    onSubmit,
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null); // State to store the uploaded file

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]); // Store the selected file in state
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const notificationData = {
            title,
            content,
            file, // Include the uploaded file in the data
        };
        onSubmit(notificationData); // Pass the data to the parent component
        setTitle("");
        setContent("");
        setFile(null); // Reset the form fields
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Notification</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Content"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Upload File (Optional):
                    </Typography>
                    <Button variant="outlined" component="label">
                        Choose File
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange} // Handle file selection
                        />
                    </Button>
                    {file && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected File: {file.name}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}