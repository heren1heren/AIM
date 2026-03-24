import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage";

import ShareLayout from "../layouts/ShareLayout"; // Use ShareLayout for all roles
import HomePage from "../pages/HomePage";
import StudentHomePage from "../features/students/pages/StudentHomePage";
import StudentAssignmentPage from "../features/students/pages/StudentAssignmentPage";
import StudentContentPage from "../features/students/pages/StudentContentPage";
import StudentGradePage from "../features/students/pages/StudentGradePage";
import AdminHomePage from "../features/admin/pages/AdminHomePage";
import ManageCoursesPage from "../features/admin/pages/ManageCoursesPage";
import ManageEnrollmentsPage from "../features/admin/pages/ManageEnrollmentsPage";
import ManageNotificationsPage from "../features/admin/pages/ManageNotificationsPage";
import ManageUsersPage from "../features/admin/pages/ManageUsersPage";
import SystemSettingsPage from "../features/admin/pages/SystemSettingsPage";
import TeacherHomePage from "../features/teachers/pages/TeacherHomePage";
import TeacherCoursePage from "../features/teachers/pages/TeacherCoursePage";
import TeacherManageAssignmentPage from "../features/teachers/pages/TeacherManageAssignmentPage";
import TeacherManageSubmissionPage from "../features/teachers/pages/TeacherManageSubmissionPage";
// import MessagesPage from "../pages/MessagePage";
import InternalServerErrorPage from "../features/auth/pages/500Page"; // Import 500 page

import UnauthorizedPage from "../features/auth/pages/401Page"; // Import 401 page
import ForbiddenPage from "../features/auth/pages/403Page"; // Import 403 page
import NotFoundPage from "../features/auth/pages/404Page"; // Import 404 page

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ShareLayout />,
        children: [
            // Common routes
            { index: true, element: <HomePage /> },

            // Admin routes
            {
                path: "admin/home",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminHomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/courses",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageCoursesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/enrollments",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageEnrollmentsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/notifications",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageNotificationsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/users",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageUsersPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin/settings",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <SystemSettingsPage />
                    </ProtectedRoute>
                ),
            },

            // Teacher routes
            {
                path: "teacher/home",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherHomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "teacher/courses",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherCoursePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "teacher/assignments",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherManageAssignmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "teacher/submissions",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <TeacherManageSubmissionPage />
                    </ProtectedRoute>
                ),
            },

            // Student routes
            {
                path: "student/home",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentHomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "student/assignments",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentAssignmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "student/content",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentContentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "student/grades",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentGradePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "login", element: <SignInPage /> }],
    },
    {
        path: "/401",
        element: <UnauthorizedPage />, // 401 Unauthorized page
    },
    {
        path: "/403",
        element: <ForbiddenPage />, // 403 Forbidden page
    },
    {
        path: "/500",
        element: <InternalServerErrorPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />, // 404 Not Found page
    },
]);
