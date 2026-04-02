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
    const navigate = useNavigate();

    const handleAddClass = async (classData: {
        name: string;
        description: string;
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

    const handleDelete = async (id: number) => {
        try {
            await deleteClass(id);
        } catch (error) {
            console.error("Error deleting class:", error);
        }
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
                                <Typography fontWeight={600}>Class Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Description</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Teacher Name</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes?.map((cls) => (
                            <TableRow key={cls.id}>
                                <TableCell>{cls.name}</TableCell>
                                <TableCell>{cls.description}</TableCell>
                                <TableCell>{cls.teacher.name}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/class/${cls.id}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        Manage
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(cls.id)}
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
        </Box>
    );
}