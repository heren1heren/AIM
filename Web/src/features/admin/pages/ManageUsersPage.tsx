import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
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

export default function ManageUsersPage() {
    const { users, loading, error, createUser, deleteUser } = useUsers();
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "student", // Default role
        profile: { nickname: "", avatar: "", bias: "" },
    });

    const handleCreateUser = async () => {
        const roleData = {
            isAdmin: newUser.role === "admin",
            isTeacher: newUser.role === "teacher",
            isStudent: newUser.role === "student",
        };

        await createUser({ ...newUser, ...roleData });
        setNewUser({
            username: "",
            password: "",
            role: "student",
            profile: { nickname: "", avatar: "", bias: "" },
        });
        setOpenDialog(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const getRole = (user: any) => {
        if (user.admin) return "Admin";
        if (user.teacher) return "Teacher";
        if (user.student) return "Student";
        return "Unknown";
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Users
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add User
            </Button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Username</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Role</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .filter((user) => !user.admin) // Exclude admin users
                            .map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        {user.profile?.nickname || "N/A"} {/* Display name */}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{getRole(user)}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => deleteUser(user.id)}
                                            disabled={user.admin} // Disable delete for admin users
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Role"
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </TextField>
                    <TextField
                        label="Password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        type="password"
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}