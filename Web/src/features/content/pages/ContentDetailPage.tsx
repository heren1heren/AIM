import React from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Link,
} from "@mui/material";
import { useContents } from "../../../hooks/useContents";

const ContentDetailPage: React.FC = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const { useContentById } = useContents();
    const { data: contentDetail, isLoading, isError } = useContentById(parseInt(contentId, 10));

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
        <Box sx={{ p: 3 }}>
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
        </Box>
    );
};

export default ContentDetailPage;