import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createNotification = async (data) => {
    const { is_global, is_for_students, is_for_teachers, class_ids, created_by, files, ...rest } = data;

    let recipients = [];

    // If the notification is global, attach it to all users
    if (is_global) {
        const allUsers = await prisma.user.findMany({
            select: { id: true },
        });
        recipients = allUsers.map((user) => ({ id: user.id }));
    }

    // If the notification is for students, attach it to all students
    if (is_for_students) {
        const allStudents = await prisma.user.findMany({
            where: { student: { isNot: null } },
            select: { id: true },
        });
        recipients = [...recipients, ...allStudents.map((student) => ({ id: student.id }))];
    }

    // If the notification is for teachers, attach it to all teachers
    if (is_for_teachers) {
        const allTeachers = await prisma.user.findMany({
            where: { teacher: { isNot: null } },
            select: { id: true },
        });
        recipients = [...recipients, ...allTeachers.map((teacher) => ({ id: teacher.id }))];
    }

    // If class_ids are provided, attach the notification to all students in those classes
    if (class_ids && class_ids.length > 0) {
        const classStudents = await prisma.user.findMany({
            where: {
                student: {
                    class_id: { in: class_ids },
                },
            },
            select: { id: true },
        });
        recipients = [...recipients, ...classStudents.map((student) => ({ id: student.id }))];
    }

    // Remove duplicate recipients
    const uniqueRecipients = Array.from(new Set(recipients.map((r) => r.id))).map((id) => ({
        id,
    }));

    // Create the notification and attach recipients and files
    return await prisma.notification.create({
        data: {
            ...rest,
            created_by,
            is_global,
            is_for_students,
            is_for_teachers,
            classes: {
                connect: class_ids?.map((id) => ({ id })) || [],
            },
            recipients: {
                connect: uniqueRecipients,
            },
            files: {
                connect: files, // Attach files to the notification
            },
        },
    });
};

// Get all notifications, including files and read_users
const getAllNotifications = async () => {
    return await prisma.notification.findMany({
        include: {
            files: true, // Include files
            read_users: true, // Include read_users
        },
    });
};

// Get a notification by ID, including files and read_users
const getNotificationById = async (id) => {
    return await prisma.notification.findUnique({
        where: { id: parseInt(id) },
        include: {
            files: true, // Include files
            read_users: true, // Include read_users
        },
    });
};

// Delete a notification
const deleteNotification = async (id) => {
    return await prisma.notification.delete({
        where: { id: parseInt(id) },
    });
};

// Get notifications by user ID, including files and read_users
const getNotificationsByUserId = async (userId) => {
    return await prisma.notification.findMany({
        where: {
            recipients: {
                some: { id: parseInt(userId) }, // Check if the user is a recipient
            },
        },
        include: {
            files: true, // Include files
            read_users: true, // Include read_users
        },
        orderBy: {
            created_at: 'desc', // Optional: Order notifications by creation date
        },
    });
};

// Mark a notification as read
const markNotificationAsRead = async (notificationId, userId) => {
    return await prisma.notification.update({
        where: { id: parseInt(notificationId) },
        data: {
            read_users: {
                connect: { id: parseInt(userId) }, // Add the user to the read_users relation
            },
        },
        include: {
            read_users: true,
        },
    });
};

export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationsByUserId,
    markNotificationAsRead,
};