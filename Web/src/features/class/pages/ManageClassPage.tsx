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
import AddClassDialog from "../components/AddClassDialog";
import DeleteClassDialog from "../components/DeleteClassDialog";
import { useClasses } from "../../../hooks/useClasses";
import { useNavigate } from "react-router-dom";

export default function ManageClassesPage() {
    const {
        classes,
        classesLoading,
        classesError,
        createClass,
        deleteClass,
    } = useClasses(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<{
        id: number;
        name: string;
    } | null>(null);

    const navigate = useNavigate();

    const handleAddClass = async (classData: {
        name: string;
        teacher_name: string;
        teacher_id: number;
        start_date: string;
        end_date: string;
    }) => {
        try {
            await createClass(classData);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error creating class:", error);
        }
    };

    const handleDelete = async () => {
        if (selectedClass) {
            try {
                await deleteClass(selectedClass.id);
                setDeleteDialogOpen(false);
                setSelectedClass(null);
            } catch (error) {
                console.error("Error deleting class:", error);
            }
        }
    };

    const openDeleteDialog = (cls: { id: number; name: string }) => {
        setSelectedClass(cls);
        setDeleteDialogOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Classes
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add Class
            </Button>

            {classesLoading && <Typography>Loading classes...</Typography>}
            {classesError && <Typography>Error loading classes</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Id</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Class Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Teacher</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Students</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes
                            ?.slice()
                            .sort((a, b) => a.id - b.id)
                            .map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell>{cls.id}</TableCell>
                                    <TableCell>{cls.name}</TableCell>
                                    <TableCell>{cls.teacher.name}</TableCell>
                                    <TableCell>{cls.students.length}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => navigate(`/classes/${cls.id}`)}
                                            sx={{ mr: 1 }}
                                        >
                                            Manage
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => openDeleteDialog({ id: cls.id, name: cls.name })}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddClassDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleAddClass}
            />

            <DeleteClassDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                className={selectedClass?.name || ""}
            />
        </Box>
    );
}