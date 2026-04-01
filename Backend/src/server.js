import express from "express";
import http from "http";
import passport from "passport";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser"; // Import cookie-parser


import initPassport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admins.js";
import assignmentRoutes from "./routes/assignments.js";
import attendanceRoutes from "./routes/attendance.js";
import classRoutes from "./routes/classes.js";
import contentRoutes from "./routes/contents.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js"

import notificationRoutes from "./routes/notifications.js";

import studentRoutes from "./routes/students.js";
import submissionRoutes from "./routes/submissions.js";
import teacherRoutes from "./routes/teacher.js";
import userRoutes from "./routes/users.js";

import initWebSocket from "./sockets/index.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", // Frontend origin
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
        credentials: true, // Allow cookies and credentials
    })
);
const prisma = new PrismaClient();

// Initialize Passport
initPassport(passport);
app.use(passport.initialize());


// Routes
app.use("/auth", authRoutes);
app.use("/admins", adminRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/classes", classRoutes);
app.use("/contents", contentRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes)

app.use("/notifications", notificationRoutes);

app.use("/students", studentRoutes);
app.use("/submissions", submissionRoutes);
app.use("/teachers", teacherRoutes);
app.use("/users", userRoutes);



// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
