import { useState, useEffect } from "react";
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

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClass } from "../../../hooks/useClasses";

export default function ManageClassesPage() {
    const {
        classes,
        fetchClasses,
        createClass,
        loading,
        error,
    } = useClass();


    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);


    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [newClass, setNewClass] = useState({
        name: "",
        description: "",
        teacher_id: "",
        start_date: "",
        end_date: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewClass((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddClass = async () => {
        await createClass({
            ...newClass,
            teacher_id: parseInt(newClass.teacher_id),
            start_date: new Date(newClass.start_date).toISOString(),
            end_date: new Date(newClass.end_date).toISOString(),
        });
        setOpenDialog(false);
        setNewClass({
            name: "",
            description: "",
            teacher_id: "",
            start_date: "",
            end_date: "",
        });
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

            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Class Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Teacher</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight={600}>Assignments</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight={600}>Attendances</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography fontWeight={600}>Students</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(classes || []).map((cls) => (
                            <TableRow key={cls.id}>
                                <TableCell>{cls.name}</TableCell>
                                <TableCell>{cls.teacher_id}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => navigate(`/class/${cls.id}/assignments`)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => navigate(`/class/${cls.id}/attendance`)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => navigate(`/class/${cls.id}/students`)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Class Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Class Name"
                        name="name"
                        value={newClass.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newClass.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Teacher ID"
                        name="teacher_id"
                        value={newClass.teacher_id}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={newClass.start_date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={newClass.end_date}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddClass} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}