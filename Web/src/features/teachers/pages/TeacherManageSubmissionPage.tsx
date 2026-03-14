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

interface Submission {
    id: string;
    assignmentId: string;
    studentName: string;
    submissionDate: string;
    grade: number | null;
}

// Mock data for submissions, assignments, and courses
const mockSubmissions: Submission[] = [
    { id: "1", assignmentId: "1", studentName: "Alice", submissionDate: "2026-03-18", grade: null },
    { id: "2", assignmentId: "1", studentName: "Bob", submissionDate: "2026-03-19", grade: 85 },
    { id: "3", assignmentId: "2", studentName: "Charlie", submissionDate: "2026-03-20", grade: null },
];

const mockAssignments = [
    { id: "1", courseId: "1", title: "Algebra Homework" },
    { id: "2", courseId: "2", title: "Mechanics Quiz" },
];

const mockCourses = [
    { id: "1", name: "Math 101" },
    { id: "2", name: "Physics 201" },
];

export default function TeacherManageSubmissionPage() {
    const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [grade, setGrade] = useState<number | null>(null);

    const handleGradeSubmission = () => {
        if (selectedSubmission && grade !== null) {
            setSubmissions((prev) =>
                prev.map((submission) =>
                    submission.id === selectedSubmission.id
                        ? { ...submission, grade }
                        : submission
                )
            );
            setOpenDialog(false);
            setSelectedSubmission(null);
            setGrade(null);
        }
    };

    const filteredAssignments = mockAssignments.filter(
        (assignment) => assignment.courseId === selectedCourseId
    );

    const filteredSubmissions = submissions.filter(
        (submission) => submission.assignmentId === selectedAssignmentId
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Submissions
            </Typography>

            {/* Course Filter */}
            <TextField
                label="Select Course"
                value={selectedCourseId}
                onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedAssignmentId(""); // Reset assignment filter
                }}
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

            {/* Assignment Filter */}
            <TextField
                label="Select Assignment"
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                select
                fullWidth
                margin="dense"
                disabled={!selectedCourseId}
            >
                {filteredAssignments.map((assignment) => (
                    <MenuItem key={assignment.id} value={assignment.id}>
                        {assignment.title}
                    </MenuItem>
                ))}
            </TextField>

            {/* Submissions Table */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Student Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Submission Date</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Grade</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                                <TableCell>{submission.studentName}</TableCell>
                                <TableCell>{submission.submissionDate}</TableCell>
                                <TableCell>
                                    {submission.grade !== null ? submission.grade : "Ungraded"}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            setSelectedSubmission(submission);
                                            setGrade(submission.grade || null);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Grade
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Grade Submission Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Grade Submission</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Student: {selectedSubmission?.studentName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Assignment:{" "}
                        {
                            mockAssignments.find(
                                (assignment) => assignment.id === selectedSubmission?.assignmentId
                            )?.title
                        }
                    </Typography>
                    <TextField
                        label="Grade"
                        type="number"
                        value={grade || ""}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleGradeSubmission} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}