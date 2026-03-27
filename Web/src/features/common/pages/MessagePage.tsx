import { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, TextField, Button } from "@mui/material";

const mockConversations = [
    {
        id: 1,
        name: "John Doe",
        messages: [
            { id: 1, sender: "John Doe", text: "Hi there!", timestamp: "2026-03-27 10:00 AM" },
            { id: 2, sender: "You", text: "Hello!", timestamp: "2026-03-27 10:05 AM" },
        ],
    },
    {
        id: 2,
        name: "Jane Smith",
        messages: [
            { id: 1, sender: "Jane Smith", text: "Are you available for a meeting?", timestamp: "2026-03-27 09:00 AM" },
            { id: 2, sender: "You", text: "Yes, let me know the time.", timestamp: "2026-03-27 09:10 AM" },
        ],
    },
];

export default function MessagePage() {
    const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
    const [newMessage, setNewMessage] = useState(""); // State for the new message text

    // Function to handle sending a message
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return; // Prevent sending empty messages

        const newMessageObject = {
            id: selectedConversation.messages.length + 1,
            sender: "You",
            text: newMessage,
            timestamp: new Date().toLocaleString(),
        };

        // Update the selected conversation with the new message
        setSelectedConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessageObject],
        }));

        // Update the mock data (to simulate real-time updates)
        const updatedConversations = mockConversations.map((conversation) =>
            conversation.id === selectedConversation.id
                ? { ...conversation, messages: [...conversation.messages, newMessageObject] }
                : conversation
        );

        // Clear the input field
        setNewMessage("");
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", p: 2 }}>
            {/* Left Side: Conversations List */}
            <Paper
                elevation={3}
                sx={{
                    width: "30%",
                    mr: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Typography variant="h6" sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                    Conversations
                </Typography>
                <List>
                    {mockConversations.map((conversation) => (
                        <ListItem
                            key={conversation.id}
                            button
                            selected={selectedConversation.id === conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                        >
                            <ListItemText primary={conversation.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Right Side: Messages */}
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h6" sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                    {selectedConversation.name}
                </Typography>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
                    {selectedConversation.messages.map((message) => (
                        <Box key={message.id} sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {message.sender} - {message.timestamp}
                            </Typography>
                            <Typography variant="body1">{message.text}</Typography>
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    ))}
                </Box>

                {/* Send Message Input */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderTop: "1px solid #ddd",
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage(); // Send message on Enter key
                        }}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSendMessage}>
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}