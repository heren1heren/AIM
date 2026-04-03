import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../../hooks/AuthContext";

interface AddContentDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    classId: number;
}

export default function AddContentDialog({ open, onClose, onSubmit, classId }: AddContentDialogProps) {
    const { userId } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedDate: "",
    });
    const [files, setFiles] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length > 5) {
                alert("You can only upload up to 5 files.");
                return;
            }
            setFiles(selectedFiles);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.assignedDate) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!userId) {
            console.error("User ID is not defined");
            return;
        }

        const payload = new FormData();
        payload.append("title", formData.title);
        payload.append("description", formData.description || "");
        payload.append("assignedDate", new Date(formData.assignedDate).toISOString());
        payload.append("class_id", classId.toString());
        payload.append("uploader_id", userId.toString());

        files.forEach((file) => {
            payload.append("files", file);
        });

        console.log("Payload being sent:", Object.fromEntries(payload.entries()));

        try {
            await onSubmit(payload);

            setFormData({ title: "", description: "", assignedDate: "" });
            setFiles([]);
        } catch (err) {
            console.error("Error submitting content:", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Content</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                />
                <TextField
                    label="Assigned Date"
                    name="assignedDate"
                    type="date"
                    value={formData.assignedDate}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Upload Files (Max: 5)
                </Typography>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                    Upload
                    <input type="file" hidden multiple onChange={handleFileChange} />
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
}