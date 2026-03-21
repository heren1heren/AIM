import express from "express";
import http from "http";
import passport from "passport";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import initPassport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admins.js";
import assignmentRoutes from "./routes/assignments.js";
import attendanceRoutes from "./routes/attendance.js";
import classRoutes from "./routes/classes.js";
import contentRoutes from "./routes/contents.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js"
import fileRoutes from "./routes/files.js";
import notificationRoutes from "./routes/notifications.js";

import studentRoutes from "./routes/students.js";
import submissionRoutes from "./routes/submissions.js";
import teacherRoutes from "./routes/teacher.js";
import userRoutes from "./routes/users.js";
import userProfileRoutes from "./routes/userProfiles.js";
import initWebSocket from "./sockets/index.js";

dotenv.config();

const app = express();
app.use(express.json());

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
app.use("/files", fileRoutes);
app.use("/notifications", notificationRoutes);

app.use("/students", studentRoutes);
app.use("/submissions", submissionRoutes);
app.use("/teachers", teacherRoutes);
app.use("/users", userRoutes);
app.use("/user-profiles", userProfileRoutes);

// Protected route example
app.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({ message: "You accessed a protected route!", user: req.user });
    }
);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
