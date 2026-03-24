import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { theme } from "./app/theme"
import { router } from "./app/router"   // ← you must add this
import './index.css'
import { AuthProvider } from "./hooks/AuthContext"; // Import AuthProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
