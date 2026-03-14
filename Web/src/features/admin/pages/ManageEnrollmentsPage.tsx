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

interface Course {
    id: string;
    name: string;
    students: string[];
}

const mockCourses: Course[] = [
    { id: "1", name: "Math 101", students: ["Alice", "Bob"] },
    { id: "2", name: "Physics 201", students: ["Charlie"] },
    { id: "3", name: "History 101", students: ["David", "Eve"] },
];

const mockStudents = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"];

export default function ManageEnrollmentsPage() {
    const [courses, setCourses] = useState<Course[]>(mockCourses);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [newStudent, setNewStudent] = useState("");

    const handleAddStudent = () => {
        if (selectedCourseId && newStudent) {
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.id === selectedCourseId
                        ? { ...course, students: [...course.students, newStudent] }
                        : course
                )
            );
            setOpenDialog(false);
            setNewStudent("");
        }
    };

    const handleRemoveStudent = (courseId: string, student: string) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.id === courseId
                    ? { ...course, students: course.students.filter((s) => s !== student) }
                    : course
            )
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Enrollments
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Course Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Enrolled Students</Typography>
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
                                <TableCell>
                                    {course.students.length > 0 ? (
                                        course.students.map((student) => (
                                            <Typography key={student} variant="body2">
                                                {student}
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveStudent(course.id, student)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No students enrolled
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            setSelectedCourseId(course.id);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Add Student
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Student Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Select Student"
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        select
                        fullWidth
                        margin="dense"
                    >
                        {mockStudents.map((student) => (
                            <MenuItem key={student} value={student}>
                                {student}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddStudent} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}