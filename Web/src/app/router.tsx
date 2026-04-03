import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage";

import ShareLayout from "../layouts/ShareLayout";
import HomePage from "../features/common/pages/HomePage"

import ManageClassesPage from "../features/class/pages/ManageClassPage";
import ManageNotificationsPage from "../features/notification/pages/ManageNotificationPage";
import ManageUsersPage from "../features/user/pages/ManageUsersPage";

import InternalServerErrorPage from "../features/auth/pages/500Page";
import UnauthorizedPage from "../features/auth/pages/401Page";
import ForbiddenPage from "../features/auth/pages/403Page";
import NotFoundPage from "../features/auth/pages/404Page";
import MessagePage from "../features/common/pages/MessagePage";
import NotificationDetailPage from "../features/notification/pages/NotificationDetailPage";
import UserProfilePage from "../features/user/pages/UserProfilePage";
import ClassDetailPage from "../features/class/pages/ClassDetailPage";
import ManageContentPage from "../features/content/pages/ManageContentPage";
import ContentDetailPage from "../features/content/pages/ContentDetailPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ShareLayout />,
        children: [
            { index: true, element: <HomePage /> },

            // Messages
            {
                path: "/messages",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "student", "teacher"]}>
                        <MessagePage />
                    </ProtectedRoute>
                ),
            },

            // Users
            {
                path: "/users",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageUsersPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <UserProfilePage />
                    </ProtectedRoute>
                ),
            },

            // Classes
            {
                path: "/classes",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageClassesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teacher/:teacherId/classes",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <ManageClassesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/classes/:classId",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <ClassDetailPage />
                    </ProtectedRoute>
                ),
            },

            // Assignments
            {
                path: "/classes/:classId/assignments",
                element: (
                    <ProtectedRoute allowedRoles={["teacher", "admin", "student"]}>
                        <div>Assignments Page</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/classes/:classId/assignments/:assignmentId",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <div>Assignment Details</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/classes/:classId/assignments/:assignmentId/submissions",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <div>Submissions Page</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/classes/:classId/assignments/:assignmentId/submissions/:submissionId",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <div>Submission Details</div>
                    </ProtectedRoute>
                ),
            },

            // Attendances
            {
                path: "/attendances",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <div>Attendances Page</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/attendances/:attendanceId",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <div>Attendance Details</div>
                    </ProtectedRoute>
                ),
            },

            // Students
            {
                path: "/students",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <div>Students Page</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/students/:studentId",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <div>Student Details</div>
                    </ProtectedRoute>
                ),
            },

            // Content
            {
                path: "/classes/:classId/contents/:contentId",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <ContentDetailPage />
                    </ProtectedRoute>
                ),
            },

            // Notifications
            {
                path: "/notifications",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageNotificationsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/notifications/:notificationId",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <NotificationDetailPage />
                    </ProtectedRoute>
                ),
            },

            // Student Assignments and Submissions
            {
                path: "/student/:studentId/assignments",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <div>Student Assignments</div>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/student/:studentId/submissions",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <div>Student Submissions</div>
                    </ProtectedRoute>
                ),
            },
        ],
    },

    // Authentication
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "login", element: <SignInPage /> }],
    },

    // Error Pages
    {
        path: "/401",
        element: <UnauthorizedPage />,
    },
    {
        path: "/403",
        element: <ForbiddenPage />,
    },
    {
        path: "/500",
        element: <InternalServerErrorPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
