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
    Avatar,
} from "@mui/material";

import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";
import { useQueryClient } from "@tanstack/react-query";

export default function ManageUsersPage() {
    const { users, usersLoading, usersError, createUser, updateUser, deleteUser } = useUsers(true);
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    const [editName, setEditName] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editRole, setEditRole] = useState("student");

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleCreateUser = async () => {
        const roleData = {
            isStudent: role === "student",
            isTeacher: role === "teacher",
        };

        await createUser({
            name,
            username,
            password,
            ...roleData,
        });

        queryClient.invalidateQueries(["users"]);

        setName("");
        setUsername("");
        setPassword("");
        setRole("student");
        setOpenAddDialog(false);
    };

    const handleEditUser = async () => {
        if (selectedUserId !== null) {
            await updateUser({
                id: selectedUserId,
                updatedData: {
                    name: editName,
                    username: editUsername,
                    password: editPassword,
                },
            });

            queryClient.invalidateQueries(["users"]);
        }

        setEditName("");
        setEditUsername("");
        setEditPassword("");
        setEditRole("student");
        setSelectedUserId(null);
        setOpenEditDialog(false);
    };

    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete !== null) {
            await deleteUser(userToDelete);

            queryClient.invalidateQueries(["users"]);
        }
        setUserToDelete(null);
        setOpenDeleteDialog(false);
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
        setOpenDeleteDialog(false);
    };

    const openEditDialogForUser = (user: any) => {
        setSelectedUserId(user.id);
        setEditName(user.name || "");
        setEditUsername(user.username);
        setEditPassword("");
        setEditRole(user.teacher ? "teacher" : "student");
        setOpenEditDialog(true);
    };

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

            {usersLoading && <p>Loading...</p>}
            {usersError && <p>Error loading users</p>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
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
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar src={user.avatarUrl || ""} alt={user.name || "User"}>
                                        {!user.avatarUrl && user.name ? user.name[0].toUpperCase() : ""}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name || "N/A"}</TableCell>
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