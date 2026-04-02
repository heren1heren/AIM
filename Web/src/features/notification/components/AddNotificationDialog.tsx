import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import { useAuth } from "../../../hooks/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleAxiosError } from "../../../utils/handleAxiosError";

interface AddNotificationDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void; // Pass FormData directly
}

const AddNotificationDialog: React.FC<AddNotificationDialogProps> = ({ open, onClose, onSubmit }) => {
    const { userId } = useAuth();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isGlobal, setIsGlobal] = useState(false);
    const [isForTeachers, setIsForTeachers] = useState(false);
    const [isForStudents, setIsForStudents] = useState(false);
    const [files, setFiles] = useState<File[]>([]); // State for uploaded files

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
        }
    };

    // Remove a file from the list
    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!userId) {
            console.error("User ID is not defined");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append("title", title);
        formData.append("message", message);
        formData.append("created_by", userId.toString());
        formData.append("is_global", isGlobal.toString());
        formData.append("is_for_teachers", isForTeachers.toString());
        formData.append("is_for_students", isForStudents.toString());
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            // Submit the form data
            await onSubmit(formData);

            // Reset form fields
            setTitle("");
            setMessage("");
            setIsGlobal(false);
            setIsForTeachers(false);
            setIsForStudents(false);
            setFiles([]);
        } catch (err) {
            // Use the utility function to log and extract the error message
            const errorMessage = handleAxiosError(err);
            console.error("Error creating notification:", errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Notification</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Target Audience
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isGlobal}
                                onChange={(e) => setIsGlobal(e.target.checked)}
                            />
                        }
                        label="Global"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isForTeachers}
                                onChange={(e) => setIsForTeachers(e.target.checked)}
                            />
                        }
                        label="All Teachers"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isForStudents}
                                onChange={(e) => setIsForStudents(e.target.checked)}
                            />
                        }
                        label="All Students"
                    />
                </FormGroup>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Upload Files
                </Typography>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                    Upload
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                    />
                </Button>
                <List>
                    {files.map((file, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNotificationDialog;