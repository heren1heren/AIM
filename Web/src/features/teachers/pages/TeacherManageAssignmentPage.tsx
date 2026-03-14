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

interface Assignment {
    id: string;
    courseId: string;
    title: string;
    dueDate: string;
    description: string;
}

// Mock data for assignments and courses
const mockAssignments: Assignment[] = [
    { id: "1", courseId: "1", title: "Algebra Homework", dueDate: "2026-03-20", description: "Solve 10 algebra problems." },
    { id: "2", courseId: "2", title: "Mechanics Quiz", dueDate: "2026-03-22", description: "Complete the mechanics quiz." },
];

const mockCourses = [
    { id: "1", name: "Math 101" },
    { id: "2", name: "Physics 201" },
];

export default function TeacherManageAssignmentPage() {
    const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
    const [openDialog, setOpenDialog] = useState(false);
    const [newAssignment, setNewAssignment] = useState<Assignment>({
        id: "",
        courseId: "",
        title: "",
        dueDate: "",
        description: "",
    });

    const handleDelete = (id: string) => {
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
    };

    const handleAddOrUpdateAssignment = () => {
        if (newAssignment.id) {
            // Update existing assignment
            setAssignments((prev) =>
                prev.map((assignment) =>
                    assignment.id === newAssignment.id ? newAssignment : assignment
                )
            );
        } else {
            // Add new assignment
            setAssignments((prev) => [
                ...prev,
                { ...newAssignment, id: Date.now().toString() },
            ]);
        }
        setOpenDialog(false);
        setNewAssignment({ id: "", courseId: "", title: "", dueDate: "", description: "" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewAssignment((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (assignment: Assignment) => {
        setNewAssignment(assignment);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Assignments
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add Assignment
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Course</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Title</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Due Date</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Description</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment) => {
                            const course = mockCourses.find((c) => c.id === assignment.courseId);
                            return (
                                <TableRow key={assignment.id}>
                                    <TableCell>{course?.name || "Unknown Course"}</TableCell>
                                    <TableCell>{assignment.title}</TableCell>
                                    <TableCell>{assignment.dueDate}</TableCell>
                                    <TableCell>{assignment.description}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleEdit(assignment)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(assignment.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Assignment Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{newAssignment.id ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Course"
                        name="courseId"
                        value={newAssignment.courseId}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        margin="dense"
                    >
                        {mockCourses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Title"
                        name="title"
                        value={newAssignment.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newAssignment.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateAssignment} color="primary">
                        {newAssignment.id ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}