import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useClasses } from "../../../hooks/useClasses";
import ContentAccordion from "../../content/components/ContentAccordion";

export default function ClassDetailPage() {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const { useClassById } = useClasses();
    const { data: classDetail, isLoading, isError } = useClassById(parseInt(classId || "0"));

    if (isLoading) {
        return <Typography>Loading class details...</Typography>;
    }

    if (isError || !classDetail) {
        return <Typography>Error loading class details or class not found.</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    {classDetail.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {classDetail.description}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    Teacher: {classDetail.teacher.name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    Number of Students: {classDetail.students.length}
                </Typography>
            </Paper>

            {/* Content Section */}
            <ContentAccordion classId={parseInt(classId || "0")} />

            <Divider sx={{ my: 3 }} />

            {/* Assignments Section */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight={600}>
                        Assignments
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        View and manage assignments for this class.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/classes/${classId}/assignments`)}
                    >
                        Go to Assignments
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Attendances Section */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight={600}>
                        Attendances
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        View and manage attendance records for this class.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/classes/${classId}/attendances`)}
                    >
                        Go to Attendances
                    </Button>
                </AccordionDetails>
            </Accordion>

            {/* Students Section */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight={600}>
                        Students
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        View and manage the list of students in this class.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/classes/${classId}/students`)}
                    >
                        Go to Students
                    </Button>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}