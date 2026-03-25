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
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
} from "@mui/material";

interface Course {
    id: string;
    name: string;
    instructor: string;
    students: number;
}

// Mock data for courses and instructors
const mockCourses: Course[] = [
    { id: "1", name: "Math 101", instructor: "John Doe", students: 30 },
    { id: "2", name: "Physics 201", instructor: "Jane Smith", students: 25 },
    { id: "3", name: "History 101", instructor: "Emily Johnson", students: 40 },
    { id: "4", name: "Biology 101", instructor: "Michael Brown", students: 35 },
];

const mockInstructors = ["John Doe", "Jane Smith", "Emily Johnson", "Michael Brown", "Sarah Connor"];

export default function ManageCoursesPage() {
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: "", instructor: "", students: 0 });

    const handleDelete = (id: string) => {
        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
    };

    const handleAddCourse = () => {
        setCourses((prevCourses) => [
            ...prevCourses,
            { id: Date.now().toString(), ...newCourse },
        ]);
        setOpenDialog(false);
        setNewCourse({ name: "", instructor: "", students: 0 });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCourse((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Courses
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add Course
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Course Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Instructor</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Students</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.instructor}</TableCell>
                                <TableCell align="right">{course.students}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(course.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => alert("Edit functionality not implemented yet")}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Course Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Course Name"
                        name="name"
                        value={newCourse.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Instructor"
                        name="instructor"
                        value={newCourse.instructor}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        margin="dense"
                    >
                        {mockInstructors.map((instructor) => (
                            <MenuItem key={instructor} value={instructor}>
                                {instructor}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Number of Students"
                        name="students"
                        type="number"
                        value={newCourse.students}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCourse} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}