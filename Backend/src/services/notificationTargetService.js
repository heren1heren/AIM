import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createNotificationTarget = async (data) => {
    return await prisma.notificationTarget.create({ data });
};

const getAllNotificationTargets = async () => {
    return await prisma.notificationTarget.findMany({
        include: { notification: true, class: true },
    });
};

const getNotificationTargetById = async (id) => {
    return await prisma.notificationTarget.findUnique({
        where: { id: parseInt(id) },
        include: { notification: true, class: true },
    });
};

const deleteNotificationTarget = async (id) => {
    return await prisma.notificationTarget.delete({
        where: { id: parseInt(id) },
    });
};

export default {
    createNotificationTarget,
    getAllNotificationTargets,
    getNotificationTargetById,
    deleteNotificationTarget,
};