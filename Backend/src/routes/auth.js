import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Use the authController for the login route
router.post("/login", authController.login);

export default router;
