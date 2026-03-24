import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import CustomDrawer from "./components/Drawer";
import { useAuth } from "../hooks/AuthContext";
import HomePage from "../pages/HomePage"; // Import the HomePage component

export default function ShareLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { roles, accessToken } = useAuth(); // Get roles and accessToken from context
    const navigate = useNavigate();

    const toggleDrawer = (state: boolean) => () => {
        setDrawerOpen(state);
    };


    // Define menu groups based on roles
    const adminTools = [
        { text: "Dashboard", onClick: () => navigate("/admin/home") },
        { text: "Manage Users", onClick: () => navigate("/admin/users") },
        { text: "Manage Class", onClick: () => navigate("/admin/classes") },
        { text: "Manage Notifications", onClick: () => navigate("/admin/notifications") },
        { text: "System Settings", onClick: () => navigate("/admin/settings") },
    ];

    const teacherTools = [
        { text: "My Courses", onClick: () => navigate("/teacher/courses") },
        { text: "Assignments", onClick: () => navigate("/teacher/assignments") },
        { text: "Submissions / Grading", onClick: () => navigate("/teacher/submissions") },
    ];

    const studentTools = [
        { text: "Home", onClick: () => navigate("/student/home") },
        { text: "Assignments", onClick: () => navigate("/student/assignments") },
        { text: "Grades", onClick: () => navigate("/student/grades") },
    ];

    const commonTools = [
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