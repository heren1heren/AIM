import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage";

import ShareLayout from "../layouts/ShareLayout";
import HomePage from "../features/common/pages/HomePage"

import ManageClassesPage from "../features/class/pages/ManageClassPage";
import ManageNotificationsPage from "../features/notification/pages/ManageNotificationPage";
import ManageUsersPage from "../features/user/pages/ManageUsersPage"

import InternalServerErrorPage from "../features/auth/pages/500Page";
import UnauthorizedPage from "../features/auth/pages/401Page"; // Import 401 page
import ForbiddenPage from "../features/auth/pages/403Page"; // Import 403 page
import NotFoundPage from "../features/auth/pages/404Page"; // Import 404 page
import MessagePage from "../features/common/pages/MessagePage";
import NotificationDetailPage from "../features/notification/pages/NotificationDetailPage";
import UserProfilePage from "../features/user/pages/UserProfilePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ShareLayout />,
        children: [
            // Common routes
            { index: true, element: <HomePage /> },
            {
                path: "/messages", element: (
                    <ProtectedRoute allowedRoles={["admin", "student", "teacher"]}>
                        <MessagePage />
                    </ProtectedRoute>
                ),
            },
            // USERS Route
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

            // CLASSES Route
            {
                path: "/classes",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageClassesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/teacher/:id/classes",
                element: (
                    <ProtectedRoute allowedRoles={["teacher"]}>
                        <ManageClassesPage />
                    </ProtectedRoute>
                ),
            },
            // class detail page
            {
                path: "/classes/:id",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                        <div></div>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "assignments", // Assignments Page for the Class
                        element: (
                            <ProtectedRoute allowedRoles={["teacher"]}>
                                <div></div> {/* Page to display all assignments for the class */}
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "assignments/:assignmentId",
                        element: (
                            <ProtectedRoute allowedRoles={["teacher"]}>
                                <div></div> {/* Page to display assignment details */}
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                path: "submissions", // Submissions for the Assignment
                                element: (
                                    <ProtectedRoute allowedRoles={["teacher"]}>
                                        <div></div> {/* Page to display all submissions for the assignment */}
                                    </ProtectedRoute>
                                ),
                            },
                        ],
                    },
                    {
                        path: "content", // Content Page for the Class
                        element: (
                            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                                <div></div>{/* Page to display all content for the class */}
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "content/:id", // Content Page for the Class
                        element: (
                            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                                <div></div>{/* Page to display all content for the class */}
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            // NOTIFICATIONS Route
            {
                path: "/notifications",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageNotificationsPage />
                    </ProtectedRoute>
                ),
            },
            // notification details
            {
                path: "/notifications/:id",
                element: (
                    <ProtectedRoute allowedRoles={["admim", "teacher", "student"]}>
                        <NotificationDetailPage /> {/* Page to display notification details */}
                    </ProtectedRoute>
                ),
            },
            // ASSIGNMENTS Route

            {
                path: "/student/:id/assignments",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <div></div>
                    </ProtectedRoute>
                ),
            },
            // SUBMISSIONS Route
            {
                path: "/student/:id/submissions",
                element: (
                    <ProtectedRoute allowedRoles={["student"]}>
                        <div></div>
                    </ProtectedRoute>
                ),
            },


            // CONTENT Route

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
