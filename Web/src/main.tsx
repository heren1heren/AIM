import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./app/theme";
import { router } from "./app/router";
import "./index.css";
import { AuthProvider, useAuth } from "./hooks/AuthContext"; // Import AuthProvider and useAuth
import { setupInterceptors } from "./services/api"; // Import setupInterceptors

// Wrapper component to set up interceptors
const AppWithInterceptors = () => {
  const { setAccessToken } = useAuth(); // Get setAccessToken from AuthContext

  // Call setupInterceptors to attach the accessToken
  setupInterceptors(setAccessToken);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppWithInterceptors />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
