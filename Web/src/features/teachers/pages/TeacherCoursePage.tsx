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
} from "@mui/material";

interface Course {
    id: string;
    name: string;
    description: string;
}

// Mock data for teacher's courses
const mockTeacherCourses: Course[] = [
    { id: "1", name: "Math 101", description: "Basic algebra and geometry concepts." },
    { id: "2", name: "Physics 201", description: "Introduction to mechanics and thermodynamics." },
];

export default function TeacherCoursePage() {
    const [courses, setCourses] = useState<Course[]>(mockTeacherCourses);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setOpenDialog(true);
    };

    const handleSaveCourse = () => {
        if (selectedCourse) {
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.id === selectedCourse.id ? selectedCourse : course
                )
            );
            setOpenDialog(false);
            setSelectedCourse(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedCourse((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                My Courses
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Course Name</Typography>
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
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.description}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleEditCourse(course)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Course Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Course Name"
                        name="name"
                        value={selectedCourse?.name || ""}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={selectedCourse?.description || ""}
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
                    <Button onClick={handleSaveCourse} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}