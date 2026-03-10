import { Box, Button, TextField, Typography } from "@mui/material";

export default function LoginPage() {
    return (
        <Box>
            <Typography variant="h5" mb={3} fontWeight={600}>
                AIM  Sign Up
            </Typography>

            <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
            />

            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
            >
                Sign In
            </Button>
        </Box>
    );
}
