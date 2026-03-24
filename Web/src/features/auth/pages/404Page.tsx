import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                textAlign: 'center',
                p: 3,
            }}
        >
            <Typography variant="h1" fontWeight="bold" sx={{ mb: 2 }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Sorry, the page you are looking for does not exist.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;