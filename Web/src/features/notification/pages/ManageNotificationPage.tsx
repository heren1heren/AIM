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
} from "@mui/material";
import AddNotificationDialog from "../components/AddNotificationDialog"; // Import the dialog component

interface Notification {
    id: string;
    title: string;
    message: string;
    target: "teacher" | "student" | "all";
    fileUrl?: string; // Optional file URL
}

const mockNotifications: Notification[] = [
    { id: "1", title: "Exam Reminder", message: "Midterm exams start next week.", target: "student" },
    { id: "2", title: "Staff Meeting", message: "There will be a staff meeting on Friday.", target: "teacher" },
    { id: "3", title: "Holiday Notice", message: "School will be closed on Monday.", target: "all" },
];

export default function ManageNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [openDialog, setOpenDialog] = useState(false);

    // Handle adding a new notification
    const handleAddNotification = (notificationData: {
        title: string;
        content: string;
        file: File | null;
    }) => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            title: notificationData.title,
            message: notificationData.content,
            target: "all", // Default target (can be updated to allow selection in the dialog)
            fileUrl: notificationData.file ? URL.createObjectURL(notificationData.file) : undefined, // Generate a URL for the uploaded file
        };

        setNotifications((prev) => [...prev, newNotification]);
        setOpenDialog(false); // Close the dialog
    };

    // Handle deleting a notification
    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
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
                            <TableCell>
                                <Typography fontWeight={600}>Attached File</Typography>
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
                                <TableCell>
                                    {notification.fileUrl ? (
                                        <a href={notification.fileUrl} target="_blank" rel="noopener noreferrer">
                                            View File
                                        </a>
                                    ) : (
                                        "No file attached"
                                    )}
                                </TableCell>
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
            <AddNotificationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleAddNotification} // Pass the handler to the dialog
            />
        </Box>
    );
}