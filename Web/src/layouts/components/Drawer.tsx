import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    menuGroups: { group: string; items: { text: string; onClick: () => void | Promise<void> }[] }[];
}

export default function CustomDrawer({ open, onClose, menuGroups }: DrawerProps) {
    const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({}); // Track expanded state for each group

    // Toggle the expanded state of a group
    const toggleGroup = (group: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation">
                {/* Always display Home link at the top */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => menuGroups.find((group) => group.group === "Common Tools")?.items[0].onClick()}>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* Render menu groups */}
                {menuGroups.map((group, index) => (
                    group.group !== "Common Tools" && ( // Skip "Common Tools" toggle
                        <List
                            key={index}
                            subheader={
                                <ListSubheader
                                    component="div"
                                    onClick={() => toggleGroup(group.group)} // Toggle expand/collapse
                                    sx={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {group.group}
                                    {expandedGroups[group.group] ? <ExpandLess /> : <ExpandMore />}
                                </ListSubheader>
                            }
                        >
                            <Collapse in={expandedGroups[group.group]} timeout="auto" unmountOnExit>
                                {group.items.map((item, itemIndex) => (
                                    <ListItem key={itemIndex} disablePadding>
                                        <ListItemButton onClick={item.onClick}>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </Collapse>
                        </List>
                    )
                ))}

                {/* Always display Messages link at the bottom */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => menuGroups.find((group) => group.group === "Common Tools")?.items[1].onClick()}>
                            <ListItemText primary="Messages" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}