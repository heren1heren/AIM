import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        setServerError(""); // clear previous server errors

        if (!validate()) return;

        // Simulated API call
        // const fakeApiResponse = {
        //     success: false,
        //     message: "Incorrect email or password",
        //     role: null,
        // };

        // // If login fails
        // if (!fakeApiResponse.success) {
        //     setServerError(fakeApiResponse.message);
        //     return;
        // }

        // If login succeeds
        // const role = fakeApiResponse.role;
        const role = "student"
        // if (role === "admin") navigate("/admin/dashboard");
        // if (role === "teacher") navigate("/teacher/home");
        if (role === "student") navigate("/student/home");
    };

    return (
        <Box>
            <Typography variant="h5" mb={3} fontWeight={600}>
                AIM Login
            </Typography>

            {serverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {serverError}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
            />

            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                onClick={handleLogin}
            >
                Sign In
            </Button>
        </Box>
    );
}
