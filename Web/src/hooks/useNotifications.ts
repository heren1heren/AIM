import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserId,
    createNotification,
    deleteNotification,
    markNotificationAsRead,
} from "../services/notificationService";

export const useNotifications = (fetchEnabled: boolean = false) => {
    const queryClient = useQueryClient();

    // Fetch all notifications
    const { data: notifications, isLoading: notificationsLoading, isError: notificationsError } = useQuery({
        queryKey: ["notifications"], // Ensure this is a tuple
        queryFn: getAllNotifications,
        enabled: fetchEnabled
    });

    // Fetch a notification by ID
    const useNotificationById = (id: number) =>
        useQuery({
            queryKey: ["notification", id], // Ensure this is a tuple
            queryFn: () => getNotificationById(id),
        });

    // Fetch notifications by User ID
    const useNotificationsByUserId = (userId: number) =>
        useQuery({
            queryKey: ["notifications", "user", userId], // Ensure this is a tuple
            queryFn: () => getNotificationsByUserId(userId),
        });

    // Fetch notifications for the current user
    const useCurrentUserNotifications = (userId: number) =>
        useQuery({
            queryKey: ["notifications", "currentUser", userId],
            queryFn: () => getNotificationsByUserId(userId),
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        });

    // Create a new notification
    const createNotificationMutation = useMutation({
        mutationFn: createNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Use object-based syntax
        },
    });

    // Delete a notification
    const deleteNotificationMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Use object-based syntax
        },
    });

    // Mark a notification as read
    const markNotificationAsReadMutation = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            markNotificationAsRead(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Refresh notifications
        },
    });

    return {
        notifications,
        notificationsLoading,
        notificationsError,
        useNotificationById,
        useNotificationsByUserId,
        useCurrentUserNotifications,
        createNotification: createNotificationMutation.mutateAsync,
        deleteNotification: deleteNotificationMutation.mutateAsync,
        markNotificationAsRead: markNotificationAsReadMutation.mutateAsync,
    };
};