import api from "./api"; // Use the configured Axios instance

const API_BASE_URL = "/notifications";

// Fetch all notifications (Admin only)
export const getAllNotifications = async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
};

// Fetch a notification by ID (Admin, Teacher, Student)
export const getNotificationById = async (id: number) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

// Fetch notifications by User ID (Admin, Teacher, Student)
export const getNotificationsByUserId = async (userId: number) => {
    const response = await api.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
};

// Create a new notification (Admin only)
export const createNotification = async (notificationData: {
    title: string;
    message: string;
    created_by: number;
    class_ids?: number[];
    is_for_students?: boolean;
    is_for_teachers?: boolean;
    is_global?: boolean;
}) => {
    const response = await api.post(`${API_BASE_URL}`, notificationData);
    return response.data;
};

// Delete a notification by ID (Admin only)
export const deleteNotification = async (id: number) => {
    await api.delete(`${API_BASE_URL}/${id}`);
};

// Mark a notification as read
export const markNotificationAsRead = async (id: number, userId: number) => {
    const response = await api.patch(`/notifications/${id}/read`, { userId });
    return response.data;
};