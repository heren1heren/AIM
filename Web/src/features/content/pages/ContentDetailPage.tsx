import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Link,
    Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useContents } from "../../../hooks/useContents";
import EditContentDialog from "../components/EditContentDialog";

const ContentDetailPage: React.FC = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const { useContentById, updateContent } = useContents();
    const { data: contentDetail, isLoading, isError } = useContentById(parseInt(contentId, 10));

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleEditSubmit = async (formData: FormData) => {
        try {
            await updateContent({
                id: parseInt(contentId || "0", 10),
                updatedContent: formData,
            });
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating content:", error);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !contentDetail) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography color="error" variant="h6">
                    Content not found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                {contentDetail.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Details: {contentDetail.description}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Date: {new Date(contentDetail.assignedDate).toLocaleDateString()}
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Files
                </Typography>
                <List>
                    {contentDetail.files.map((file) => (
                        <ListItem key={file.id}>
                            <ListItemText
                                primary={
                                    <Link href={file.signedUrl} target="_blank" rel="noopener">
                                        {file.filename}
                                    </Link>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={() => setEditDialogOpen(true)}
            >
                <EditIcon />
            </Fab>

            <EditContentDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={handleEditSubmit}
                content={contentDetail}
            />
        </Box>
    );
};

export default ContentDetailPage;