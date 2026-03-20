import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createNotification = async (data) => {
    return await prisma.notification.create({
        data,
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

// Fetch notifications for students in a specific class
const getNotificationForStudentInClassByClassId = async (classId) => {
    return await prisma.notification.findMany({
        where: {
            class_id: parseInt(classId),

        },
    });
};


const getNotificationByIsForStudent = async () => {
    return await prisma.notification.findMany({
        where: {
            is_for_students: true,
        },
    });
};


const getNotificationByIsForTeacher = async () => {
    return await prisma.notification.findMany({
        where: {
            is_for_teachers: true,
        },
    });
};

const getNotificationByIsForGlobal = async () => {
    return await prisma.notification.findMany({
        where: {
            is_global: true,
        },
    });
};

export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationForStudentInClassByClassId,
    getNotificationByIsForStudent,
    getNotificationByIsForTeacher,
    getNotificationByIsForGlobal,
};