import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Avatar,
    Box,
} from "@mui/material";
import { useState } from "react";
import { useTeachers } from "../../../hooks/useUsers";

interface AddClassDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (classData: {
        name: string;
        description: string;
        teacher_id: number;
        start_date: string;
        end_date: string;
    }) => void;
}

export default function AddClassDialog({ open, onClose, onSubmit }: AddClassDialogProps) {
    const [classData, setClassData] = useState({
        name: "",
        description: "",
        teacher_id: "",
        start_date: "",
        end_date: "",
    });

    const { data: teachers, isLoading: teachersLoading, isError: teachersError } = useTeachers(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClassData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTeacherChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setClassData((prev) => ({ ...prev, teacher_id: e.target.value as string }));
    };

    const handleSubmit = () => {
        onSubmit({
            ...classData,
            teacher_id: parseInt(classData.teacher_id, 10),
        });
        setClassData({
            name: "",
            description: "",
            teacher_id: "",
            start_date: "",
            end_date: "",
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogContent>
                <TextField
                    label="Class Name"
                    name="name"
                    value={classData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={classData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel shrink id="teacher-select-label">
                        Select Teacher
                    </InputLabel>
                    <Select
                        labelId="teacher-select-label"
                        value={classData.teacher_id}
                        onChange={handleTeacherChange}
                        displayEmpty
                        label="Select Teacher"
                    >
                        <MenuItem value="" disabled>
                            <em>Select a Teacher</em>
                        </MenuItem>
                        {teachersLoading ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} />
                            </MenuItem>
                        ) : teachersError ? (
                            <MenuItem disabled>
                                <Typography color="error">Failed to load teachers</Typography>
                            </MenuItem>
                        ) : (
                            teachers?.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                src={teacher.avatarUrl || ""}
                                                alt={teacher.name}
                                                sx={{ width: 24, height: 24, marginRight: 1 }}
                                            >
                                                {!teacher.avatarUrl && teacher.name ? teacher.name[0].toUpperCase() : ""}
                                            </Avatar>
                                            {teacher.name}
                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            ID: {teacher.id}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={classData.start_date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={classData.end_date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}