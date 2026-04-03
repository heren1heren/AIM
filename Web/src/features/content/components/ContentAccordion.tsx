import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
    Box,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useContents } from "../../../hooks/useContents";
import AddContentDialog from "./AddContentDialog";

interface ContentAccordionProps {
    classId: number;
}

export default function ContentAccordion({ classId }: ContentAccordionProps) {
    const { useContentsByClassId, createContent } = useContents(false);
    const { data: contents, isLoading, isError } = useContentsByClassId(classId);
    const [expanded, setExpanded] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Class ID:", classId);
        console.log("Contents Data:", contents);
        if (isError) {
            console.error("Error fetching contents");
        }
    }, [classId, contents, isError]);

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleAddContent = async (formData: FormData) => {
        try {
            await createContent(formData);
            handleDialogClose();
        } catch (error) {
            console.error("Error adding content:", error);
        }
    };

    const handleContentClick = (contentId: number) => {
        navigate(`/classes/${classId}/contents/${contentId}`);
    };

    const safeContents = Array.isArray(contents) ? contents : [];

    return (
        <>
            <Accordion expanded={expanded} onChange={handleToggle}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>Contents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {isLoading ? (
                        <CircularProgress />
                    ) : isError ? (
                        <Typography color="error">Error loading contents</Typography>
                    ) : safeContents.length > 0 ? (
                        safeContents.map((content) => (
                            <Box
                                key={content.id}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                    },
                                    "&:active": {
                                        backgroundColor: "#e0e0e0",
                                    },
                                }}
                                onClick={() => handleContentClick(content.id)}
                            >
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {content.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {content.description || "No description available"}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Date: {new Date(content.assignedDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No contents available</Typography>
                    )}
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDialogOpen}
                        >
                            Add Content
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <AddContentDialog
                classId={classId}
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleAddContent}
            />
        </>
    );
}