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
    Link,
} from "@mui/material";
import AddNotificationDialog from "../components/AddNotificationDialog";
import { useNotifications } from "../../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export default function ManageNotificationsPage() {
    const {
        notifications,
        notificationsLoading,
        notificationsError,
        createNotification,
        deleteNotification,
    } = useNotifications(true);

    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    // Handle adding a new notification
    const handleAddNotification = async (notificationData: {
        title: string;
        message: string;
        is_global: boolean;
        is_for_teachers: boolean;
        is_for_students: boolean;
        class_ids?: number[]; // Optional class IDs
        files?: File[]; // Optional files
    }) => {
        try {
            await createNotification(notificationData);
            setOpenDialog(false); // Close the dialog
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    };

    // Handle deleting a notification
    const handleDelete = async (id: number) => {
        try {
            await deleteNotification(id);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
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

            {notificationsLoading && <Typography>Loading notifications...</Typography>}
            {notificationsError && <Typography>Error loading notifications</Typography>}

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
                                <Typography fontWeight={600}>Files</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notifications?.map((notification) => (
                            <TableRow key={notification.id}>
                                <TableCell>{notification.title}</TableCell>
                                <TableCell>{notification.message}</TableCell>
                                <TableCell>
                                    {notification.is_global
                                        ? "Global"
                                        : notification.is_for_teachers
                                            ? "Teachers"
                                            : notification.is_for_students
                                                ? "Students"
                                                : "Classes"}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/notifications/${notification.id}/files`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {notification.files?.length || 0} Files
                                    </Link>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/notifications/${notification.id}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        View
                                    </Button>
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
                onSubmit={handleAddNotification}
            />
        </Box>
    );
}