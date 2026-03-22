import { Server } from "socket.io";

const users = {}; // Map userId to socket.id

const initWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // Explicitly allow localhost
            methods: ["GET", "POST"],
        },
    });

    console.log("WebSocket server initialized"); // Add this log

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("error", (err) => {
            console.error("Socket error:", err);
        });

        // Store userId when a user connects
        socket.on("register", (payload) => {
            console.log("Register event payload received:", payload); // Log the entire payload

            const userId = payload.userId; // Extract userId from the payload
            if (!userId) {
                console.error("Invalid payload: userId is undefined");
                return;
            }

            users[userId] = socket.id;
            console.log("User registered:", userId, socket.id);
            console.log("Current users:", users); // Log all registered users
        });

        // Handle private messages
        socket.on("privateMessage", (payload) => {
            console.log("Private message payload received:", payload);

            const { senderId, recipientId, message } = payload.data; // Extract from payload.data
            const recipientSocketId = users[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", {
                    senderId,
                    message,
                });
            } else {
                console.log("Recipient not connected:", recipientId);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            // Remove user from the users map
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
        });
    });
};

export default initWebSocket;
