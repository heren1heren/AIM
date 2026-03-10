import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6">Student Portal</Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
