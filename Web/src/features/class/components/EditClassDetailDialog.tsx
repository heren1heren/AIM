import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

interface EditClassDetailDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedClassData: {
        name: string;
        description: string;
        teacher_id: number;
        start_date: string;
        end_date: string;
    }) => void;
    classData: {
        name: string;
        description: string;
        teacher_id: number;
        start_date: string;
        end_date: string;
    };
}

export default function EditClassDetailDialog({
    open,
    onClose,
    onSubmit,
    classData,
}: EditClassDetailDialogProps) {
    const [updatedClass, setUpdatedClass] = useState(classData);

    useEffect(() => {
        // Reset the form data when the dialog opens
        if (open) {
            setUpdatedClass(classData);
        }
    }, [open, classData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedClass((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit({
            ...updatedClass,
            teacher_id: parseInt(updatedClass.teacher_id.toString(), 10),
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Class Details</DialogTitle>
            <DialogContent>
                <TextField
                    label="Class Name"
                    name="name"
                    value={updatedClass.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={updatedClass.description}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Teacher ID"
                    name="teacher_id"
                    value={updatedClass.teacher_id}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={updatedClass.start_date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={updatedClass.end_date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}