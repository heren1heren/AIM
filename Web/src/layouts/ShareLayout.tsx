import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import CustomDrawer from "./components/Drawer";
import { useAuth } from "../hooks/AuthContext";

export default function ShareLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { roles, accessToken } = useAuth(); // Get roles and accessToken from context
    const navigate = useNavigate();

    const toggleDrawer = (state: boolean) => () => {
        setDrawerOpen(state);
    };

    // Define menu groups based on roles
    const adminTools = [

        { text: "Manage Users", onClick: () => navigate("/admin/users") },
        { text: "Manage Class", onClick: () => navigate("/admin/classes") },
        { text: "Manage Notifications", onClick: () => navigate("/admin/notifications") },
        { text: "System Settings", onClick: () => navigate("/admin/settings") },
    ];

    const teacherTools = [
        { text: "My Classes", onClick: () => navigate("/teacher/classes") },
        { text: "Manage Assignments", onClick: () => navigate("/teacher/assignments") },
        { text: "Manage Submissions / Grading", onClick: () => navigate("/teacher/submissions") },
    ];

    const studentTools = [
        { text: "Assignments", onClick: () => navigate("/student/assignments") },
        { text: "Grades", onClick: () => navigate("/student/grades") },
        { text: "Your Class", onClick: () => navigate("/student/classes") }, // Added Your Class link
    ];

    const commonTools = [
        { text: "Home", onClick: () => navigate("/") },
        { text: "Messages", onClick: () => navigate("/messages") },
    ];

    const menuItems = [
        ...(roles?.includes("admin") ? [{ group: "Admin Tools", items: adminTools }] : []),
        ...(roles?.includes("admin") || roles?.includes("teacher")
            ? [{ group: "Teacher Tools", items: teacherTools }]
            : []),
        ...(roles?.includes("student") ? [{ group: "Student Tools", items: studentTools }] : []),
        { group: "Common Tools", items: commonTools },
    ];

    if (!accessToken) {
        return (
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                <NavBar onMenuClick={toggleDrawer(true)} />
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            {/* NavBar */}
            <NavBar onMenuClick={toggleDrawer(true)} />

            {/* Drawer */}
            <CustomDrawer
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                menuGroups={menuItems} // Pass grouped menu items to the drawer
            />

            {/* Page Content */}
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}