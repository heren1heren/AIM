import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Login route
router.post("/login", authController.login);

// Logout route
router.post("/logout", authController.logout);

// Refresh token route
router.post("/refresh", authController.refreshAccessToken); // Added refresh token route

export default router;
