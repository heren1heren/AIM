import express from "express";
import http from "http";
import passport from "passport";
import dotenv from "dotenv";

import initPassport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import initWebSocket from "./sockets/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// Passport setup
initPassport(passport);
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

// Protected example route
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
