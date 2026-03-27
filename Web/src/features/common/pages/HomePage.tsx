import { Typography, Box, Paper, CircularProgress, Card, CardContent } from "@mui/material";
import { useAuth } from "../../../hooks/AuthContext";
import useWordOfTheDay from "../../../hooks/useWordOfTheDay";

export default function HomePage() {
    const { accessToken, roles } = useAuth(); // Get accessToken and roles from AuthContext
    const { data, loading, error } = useWordOfTheDay(); // Use the Word of the Day hook

    return (
        <Box sx={{ p: 3 }}>
            {!accessToken ? (
                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Welcome to the AIM School Portal
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Log in to use this application.
                    </Typography>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Welcome to the AIM School Portal
                    </Typography>



                    {/* Student Section */}
                    {roles?.includes("student") && (
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                mb: 3,
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Student Dashboard
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                You are now logged in as a Student. Use the navigation bar to access
                                your classes, assignments, and announcements.
                            </Typography>
                        </Paper>
                    )}

                    {/* Word of the Day Section */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Word of the Day
                        </Typography>

                        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {data && (
                            <Card elevation={3} sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {data.word}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Part of Speech: {data.partOfSpeech}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {data.meaning}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        Example: "{data.example}"
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 1, display: "block" }}
                                    >
                                        Date: {new Date(data.date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
