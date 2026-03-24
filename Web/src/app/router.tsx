import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage";

import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../pages/HomePage";
import StudentLayout from "../layouts/StudentLayout";
import StudentHomePage from "../features/students/pages/StudentHomePage";
import StudentAssignmentPage from "../features/students/pages/StudentAssignmentPage";
import StudentContentPage from "../features/students/pages/StudentContentPage";
import StudentGradePage from "../features/students/pages/StudentGradePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminHomePage from "../features/admin/pages/AdminHomePage";
import ManageCoursesPage from "../features/admin/pages/ManageCoursesPage";
import ManageEnrollmentsPage from "../features/admin/pages/ManageEnrollmentsPage";
import ManageNotificationsPage from "../features/admin/pages/ManageNotificationsPage";
import ManageUsersPage from "../features/admin/pages/ManageUsersPage";
import SystemSettingsPage from "../features/admin/pages/SystemSettingsPage";
import TeacherLayout from "../layouts/TeacherLayout";
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
        element: <HomeLayout />,
        children: [{ index: true, element: <HomePage /> }],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "login", element: <SignInPage /> }],
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "home", element: <AdminHomePage /> },
            { path: "courses", element: <ManageCoursesPage /> },
            { path: "enrollments", element: <ManageEnrollmentsPage /> },
            { path: "notifications", element: <ManageNotificationsPage /> },
            { path: "users", element: <ManageUsersPage /> },
            { path: "settings", element: <SystemSettingsPage /> },
        ],
    },
    {
        path: "/teacher",
        element: (
            <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "home", element: <TeacherHomePage /> },
            { path: "courses", element: <TeacherCoursePage /> },
            { path: "assignments", element: <TeacherManageAssignmentPage /> },
            { path: "submissions", element: <TeacherManageSubmissionPage /> },
        ],
    },
    {
        path: "/student",
        element: (
            <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "home", element: <StudentHomePage /> },
            { path: "assignments", element: <StudentAssignmentPage /> },
            { path: "content", element: <StudentContentPage /> },
            { path: "grades", element: <StudentGradePage /> },
        ],
    },
    // {
    //     path: "/messages",
    //     element: (
    //         <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
    //             <MessagesPage />
    //         </ProtectedRoute>
    //     ),
    // },
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
