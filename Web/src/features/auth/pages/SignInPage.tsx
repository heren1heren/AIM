import { useState } from "react";
import { Box, Button, TextField, Typography, Alert, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/AuthContext"; // Import useAuth

export default function SignInPage() {
    const { setAccessToken, setRoles } = useAuth(); // Use AuthContext to set accessToken and roles
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [serverError, setServerError] = useState("");

    const handleLogin = async () => {
        setServerError("");

        try {
            const response = await api.post("/auth/login", { username, password });

            // Extract tokens and roles from the response
            const { accessToken, refreshToken, roles } = response.data;

            // Set accessToken and roles in AuthContext
            setAccessToken(accessToken);
            setRoles(roles);

            // Store refreshToken securely (e.g., in localStorage or cookies)
            localStorage.setItem("refreshToken", refreshToken);

            // Redirect based on roles
            if (roles.includes("admin")) {
                navigate("/admin/home");
            } else if (roles.includes("teacher")) {
                navigate("/teacher/home");
            } else if (roles.includes("student")) {
                navigate("/student/home");
            } else {
                setServerError("No valid role found for this user.");
            }
        } catch (error) {
            setServerError("Invalid username or password");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
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
                label="Username"
                type="text"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
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
