import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                }}
            >
                <Outlet />
            </Paper>
        </Box>
    );
}
