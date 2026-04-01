import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./app/theme";
import { router } from "./app/router";
import "./index.css";
import { AuthProvider, useAuth } from "./hooks/AuthContext"; // Import AuthProvider and useAuth
import { setupInterceptors } from "./services/api"; // Import setupInterceptors
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Wrapper component to set up interceptors

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppWithInterceptors />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
