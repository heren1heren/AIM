import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import { useContents } from "../../../hooks/useContents";
import AddContentDialog from "../components/AddContentDialog";

export default function ManageContentPage() {
    const { classId } = useParams<{ classId: string }>();
    const [openDialog, setOpenDialog] = useState(false);
    const { useContentsByClassId, createContent } = useContents();
    const { data: contents, isLoading, isError } = useContentsByClassId(parseInt(classId || "0"));

    const handleAddContent = async (contentData: any) => {
        try {
            await createContent(contentData);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error adding content:", error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Manage Contents
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setOpenDialog(true)}
            >
                Add Content
            </Button>

            {isLoading && <Typography>Loading contents...</Typography>}
            {isError && <Typography>Error loading contents</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography fontWeight={600}>Title</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Description</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight={600}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contents?.map((content) => (
                            <TableRow key={content.id}>
                                <TableCell>
                                    <Typography>{content.title}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{content.description}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => console.log("Edit content", content.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => console.log("Delete content", content.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddContentDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddContent={handleAddContent}
            />
        </Box>
    );
}