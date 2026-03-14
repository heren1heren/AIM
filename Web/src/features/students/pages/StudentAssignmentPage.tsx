import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText } from "@mui/material";

interface Assignment {
    id: string;
    title: string;
    dueDate: string; // ISO date string
    description: string;
}

// Mock data for assignments
const mockAssignments: Assignment[] = [
    {
        id: "1",
        title: "Math Homework",
        dueDate: "2026-03-15",
        description: "Complete exercises 1 to 10 from chapter 5.",
    },
    {
        id: "2",
        title: "Science Project",
        dueDate: "2026-03-20",
        description: "Prepare a model of the solar system.",
    },
    {
        id: "3",
        title: "History Essay",
        dueDate: "2026-03-18",
        description: "Write an essay on the Industrial Revolution.",
    },
];

export default function StudentAssignmentPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate fetching data with a timeout
        const loadMockAssignments = () => {
            setLoading(true);
            setTimeout(() => {
                try {
                    // Sort mock assignments by due date
                    const sortedAssignments = mockAssignments.sort((a, b) =>
                        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    );
                    setAssignments(sortedAssignments);
                } catch (err: any) {
                    setError(`Failed to load assignments with error: ${err}`);
                } finally {
                    setLoading(false);
                }
            }, 1000); // Simulate a 1-second delay
        };

        loadMockAssignments();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Your Assignments
            </Typography>

            {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            {!loading && !error && assignments.length === 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No assignments found.
                </Typography>
            )}
            {!loading && !error && assignments.length > 0 && (
                <List>
                    {assignments.map((assignment) => (
                        <ListItem key={assignment.id} sx={{ mb: 2 }}>
                            <Paper elevation={2} sx={{ p: 2, width: "100%" }}>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" fontWeight={600}>
                                            {assignment.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {assignment.description}
                                            </Typography>
                                        </>
                                    }
                                />
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}