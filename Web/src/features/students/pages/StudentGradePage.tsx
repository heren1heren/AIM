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
} from "@mui/material";

interface Grade {
    id: string;
    assignmentName: string;
    grade: number; // Grade received for the assignment
    weight: number; // Weight of the assignment as a percentage of the total grade
}

// Mock data for grades
const mockGrades: Grade[] = [
    { id: "1", assignmentName: "Math Homework", grade: 85, weight: 20 },
    { id: "2", assignmentName: "Science Project", grade: 90, weight: 30 },
    { id: "3", assignmentName: "History Essay", grade: 75, weight: 25 },
    { id: "4", assignmentName: "English Assignment", grade: 80, weight: 25 },
];

export default function StudentGradePage() {
    const [grades] = useState<Grade[]>(mockGrades);

    // Calculate the weighted total percentage
    const totalPercentage = grades.reduce(
        (sum, grade) => sum + (grade.grade * grade.weight) / 100,
        0
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Grades
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Assignment Name</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Grade</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography fontWeight={600}>Weight (%)</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.map((grade) => (
                            <TableRow key={grade.id}>
                                <TableCell>{grade.assignmentName}</TableCell>
                                <TableCell align="right">{grade.grade}</TableCell>
                                <TableCell align="right">{grade.weight}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={2} align="right" sx={{ fontWeight: 600 }}>
                                Total Percentage
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {totalPercentage.toFixed(2)}%
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}