import { useState } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,

} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ContentItem {
    id: string;
    title: string;
    description: string;
}

interface WeeklyContent {
    week: string;
    items: ContentItem[];
}

// Mock data for weekly content
const mockContent: WeeklyContent[] = [
    {
        week: "Week 1",
        items: [
            { id: "1", title: "Introduction to Algebra", description: "Watch the video on basic algebra concepts." },
            { id: "2", title: "Algebra Worksheet", description: "Complete the worksheet on algebra basics." },
        ],
    },
    {
        week: "Week 2",
        items: [
            { id: "3", title: "Geometry Basics", description: "Read the chapter on geometry basics." },
            { id: "4", title: "Geometry Quiz", description: "Take the quiz on geometry concepts." },
        ],
    },
    {
        week: "Week 3",
        items: [
            { id: "5", title: "Trigonometry Introduction", description: "Watch the video on trigonometry basics." },
            { id: "6", title: "Trigonometry Worksheet", description: "Solve the worksheet on trigonometric functions." },
        ],
    },
];

export default function StudentContentPage() {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Content
            </Typography>

            {mockContent.map((weekContent) => (
                <Accordion
                    key={weekContent.week}
                    expanded={expanded === weekContent.week}
                    onChange={handleAccordionChange(weekContent.week)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`${weekContent.week}-content`}
                        id={`${weekContent.week}-header`}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            {weekContent.week}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {weekContent.items.map((item) => (
                                <ListItem key={item.id} sx={{ mb: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" fontWeight={600}>
                                                {item.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}