import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createNotification = async (data) => {
    const { is_global, is_for_students, is_for_teachers, class_ids, created_by, ...rest } = data;

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
            where: { student: { isNot: null } }, // Only users with a student relation
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
                    class_id: { in: class_ids.map((id) => parseInt(id)) }, // Students in the specified classes
                },
            },
            select: { id: true },
        });
        recipients = [...recipients, ...classStudents.map((student) => ({ id: student.id }))];
    }


    const uniqueRecipients = Array.from(new Set(recipients.map((r) => r.id))).map((id) => ({
        id,
    }));


    return await prisma.notification.create({
        data: {
            ...rest,
            created_by,
            is_global,
            is_for_students,
            is_for_teachers,
            classes: {
                connect: class_ids?.map((id) => ({ id: parseInt(id) })) || [], // Associate with classes
            },
            recipients: {
                connect: uniqueRecipients,
            },
        },
    });
};

const getAllNotifications = async () => {
    return await prisma.notification.findMany({});
};

const getNotificationById = async (id) => {
    return await prisma.notification.findUnique({
        where: { id: parseInt(id) },
    });
};

const deleteNotification = async (id) => {
    return await prisma.notification.delete({
        where: { id: parseInt(id) },
    });
};

const getNotificationsByUserId = async (userId) => {
    return await prisma.notification.findMany({
        where: {
            recipients: {
                some: { id: parseInt(userId) }, // Check if the user is a recipient
            },
        },
        orderBy: {
            created_at: 'desc', // Optional: Order notifications by creation date
        },
    });
};

const markNotificationAsRead = async (notificationId, userId) => {
    return await prisma.notification.update({
        where: { id: parseInt(notificationId) },
        data: {
            read_users: {
                connect: { id: parseInt(userId) }, // Add the user to the read_users relation
            },
        },
    });
};

export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationsByUserId, // Export the new function
    markNotificationAsRead, // Export the markNotificationAsRead function
};