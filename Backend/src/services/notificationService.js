import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createNotification = async (data) => {
    return await prisma.notification.create({
        data,
        include: { notification_targets: true },
    });
};

const getAllNotifications = async () => {
    return await prisma.notification.findMany({
        include: { notification_targets: true },
    });
};

const getNotificationById = async (id) => {
    return await prisma.notification.findUnique({
        where: { id: parseInt(id) },
        include: { notification_targets: true },
    });
};

const deleteNotification = async (id) => {
    return await prisma.notification.delete({
        where: { id: parseInt(id) },
    });
};

export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
};