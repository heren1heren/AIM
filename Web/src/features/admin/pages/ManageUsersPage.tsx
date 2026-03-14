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

interface User {
    id: string;
    name: string;
    email: string;
    role: "teacher" | "student";
}

// Mock data for users
const mockUsers: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "student" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "teacher" },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "student" },
];

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState<User>({
        id: "",
        name: "",
        email: "",
        role: "student",
    });
    const [password, setPassword] = useState("");

    const handleDelete = (id: string) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
    };

    const handleAddUser = () => {
        setUsers((prev) => [
            ...prev,
            { ...newUser, id: Date.now().toString() },
        ]);
        setOpenDialog(false);
        setNewUser({ id: "", name: "", email: "", role: "student" });
        setPassword("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Email</Typography>
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(user.id)}
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
                        label="Name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={newUser.email}
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
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </TextField>
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddUser} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}