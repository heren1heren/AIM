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

import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";

export default function ManageUsersPage() {
    const { users, loading, error, createUser, updateUser, deleteUser, fetchUsers } = useUsers();


    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    // Edit User State
    const [editName, setEditName] = useState("");
    const [editNickname, setEditNickname] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editRole, setEditRole] = useState("student");

    // Dialog States
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // Handle Create User
    const handleCreateUser = async () => {
        const roleData = {
            isStudent: role === "student",
            isTeacher: role === "teacher",
        };

        console.log("Sending user data to createUser:", {
            name,
            username,
            password,
            profile: { nickname },
            ...roleData,
        }); // Debugging log

        await createUser({
            name,
            username,
            password,
            profile: { nickname },
            ...roleData,
        });

        // Reset fields
        setName("");
        setNickname("");
        setUsername("");
        setPassword("");
        setRole("student");
        setOpenAddDialog(false);
        await fetchUsers();
    };

    // Handle Edit User
    const handleEditUser = async () => {
        if (selectedUserId !== null) {
            await updateUser(selectedUserId, {
                name: editName,
                username: editUsername,
                password: editPassword,
                profile: { nickname: editNickname },
            });
        }

        // Reset fields
        setEditName("");
        setEditNickname("");
        setEditUsername("");
        setEditPassword("");
        setEditRole("student");
        setSelectedUserId(null);
        setOpenEditDialog(false);
    };

    // Handle Delete User
    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete !== null) {
            await deleteUser(userToDelete);
        }
        setUserToDelete(null);
        setOpenDeleteDialog(false);
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
        setOpenDeleteDialog(false);
    };

    // Open Edit Dialog
    const openEditDialogForUser = (user: any) => {
        setSelectedUserId(user.id);
        setEditName(user.name || "");
        setEditNickname(user.profile?.nickname || "");
        setEditUsername(user.username);
        setEditPassword("");
        setEditRole(user.teacher ? "teacher" : "student");
        setOpenEditDialog(true);
    };

    // Get Role
    const getRole = (user: any) => {
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
                onClick={() => setOpenAddDialog(true)}
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
                                <Typography fontWeight={600}>Nickname</Typography>
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name || "N/A"}</TableCell>
                                <TableCell>{user.profile?.nickname || "N/A"}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{getRole(user)}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => openEditDialogForUser(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteClick(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <AddUserDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleCreateUser}
                name={name}
                setName={setName}
                nickname={nickname}
                setNickname={setNickname}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
            />

            <EditUserDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                onSubmit={handleEditUser}
                name={editName}
                setName={setEditName}
                nickname={editNickname}
                setNickname={setEditNickname}
                username={editUsername}
                setUsername={setEditUsername}
                password={editPassword}
                setPassword={setEditPassword}
            />

            <DeleteUserDialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
}