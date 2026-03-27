import { useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
} from "@mui/material";

interface Notification {
    id: string;
    title: string;
    message: string;
    target: "teacher" | "student" | "all";
}

const mockNotifications: Notification[] = [
    { id: "1", title: "Exam Reminder", message: "Midterm exams start next week.", target: "student" },
    { id: "2", title: "Staff Meeting", message: "There will be a staff meeting on Friday.", target: "teacher" },
    { id: "3", title: "Holiday Notice", message: "School will be closed on Monday.", target: "all" },
];

export default function ManageNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [openDialog, setOpenDialog] = useState(false);
    const [newNotification, setNewNotification] = useState<Notification>({
        id: "",
        title: "",
        message: "",
        target: "all",
    });

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const handleAddNotification = () => {
        setNotifications((prev) => [
            ...prev,
            { ...newNotification, id: Date.now().toString() },
        ]);
        setOpenDialog(false);
        setNewNotification({ id: "", title: "", message: "", target: "all" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewNotification((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Notifications
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add Notification
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Title</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Message</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Target</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications.map((notification) => (
                            <TableRow key={notification.id}>
                                <TableCell>{notification.title}</TableCell>
                                <TableCell>{notification.message}</TableCell>
                                <TableCell>{notification.target}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(notification.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Notification Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add Notification</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        name="title"
                        value={newNotification.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Message"
                        name="message"
                        value={newNotification.message}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Target"
                        name="target"
                        value={newNotification.target}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNotification} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}