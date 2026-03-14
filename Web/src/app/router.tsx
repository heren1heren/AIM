import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            { index: true, element: <HomePage /> }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <SignInPage /> },
            { path: "signup", element: <SignUpPage /> }
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "home", element: <AdminHomePage /> },
            { path: "courses", element: <ManageCoursesPage /> },
            { path: "enrollments", element: <ManageEnrollmentsPage /> },
            { path: "notifications", element: <ManageNotificationsPage /> },
            { path: "users", element: <ManageUsersPage /> },
            { path: "settings", element: <SystemSettingsPage /> }
        ]
    },
    {
        path: "/teacher",
        element: <TeacherLayout />,
        children: [
            { path: "home", element: <TeacherHomePage /> },
            { path: "courses", element: <TeacherCoursePage /> },
            { path: "assignments", element: <TeacherManageAssignmentPage /> },
            { path: "submissions", element: <TeacherManageSubmissionPage /> },

        ]
    },
    {
        path: "/student",
        element: <StudentLayout />,
        children: [
            { path: "home", element: <StudentHomePage /> },
            { path: "assignments", element: <StudentAssignmentPage /> },
            { path: "content", element: <StudentContentPage /> },
            { path: "grades", element: <StudentGradePage /> }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found, you most likely enter an invalid url</div>
    }
]);
