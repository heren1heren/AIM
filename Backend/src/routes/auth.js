import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
    const { username } = req.body;

    // Normally you'd validate username/password here
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ token });
});

export default router;
