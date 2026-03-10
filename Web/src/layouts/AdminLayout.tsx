import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    ListItemButton,
    Menu,
    MenuItem,
    Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
    const [open, setOpen] = useState(false);


    const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);
    const [notifMenuAnchor, setNotifMenuAnchor] = useState<HTMLElement | null>(null);

    const toggleDrawer = (state: boolean) => () => {
        setOpen(state);
    };

    const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const closeProfileMenu = () => {
        setProfileMenuAnchor(null);
    };

    const openNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
        setNotifMenuAnchor(event.currentTarget);
    };

    const closeNotifMenu = () => {
        setNotifMenuAnchor(null);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar position="static" color="primary">
                <Toolbar>

                    {/* Hamburger menu */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Title */}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Portal
                    </Typography>

                    {/* Notification bell */}
                    <IconButton color="inherit" onClick={openNotifMenu} sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Profile icon */}
                    <IconButton color="inherit" onClick={openProfileMenu}>
                        <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
                    </IconButton>

                    {/* Notification Menu */}
                    <Menu
                        anchorEl={notifMenuAnchor}
                        open={Boolean(notifMenuAnchor)}
                        onClose={closeNotifMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={closeNotifMenu}>New assignment posted</MenuItem>
                        <MenuItem onClick={closeNotifMenu}>Your grade has been updated</MenuItem>
                        <MenuItem onClick={closeNotifMenu}>Class schedule changed</MenuItem>
                    </Menu>

                    {/* Profile Menu */}
                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={closeProfileMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={closeProfileMenu}>Account</MenuItem>
                        <MenuItem onClick={closeProfileMenu}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer menu */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Content" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Grade" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Assignments" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Page content */}
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
