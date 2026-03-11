import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

export default function HomeLayout() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        AIM School Portal
                    </Typography>

                    <Button color="inherit" onClick={() => navigate("/auth/login")}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
