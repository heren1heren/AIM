import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const markAttendance = async (data) => {
    return await prisma.attendance.create({ data });
};

const getAllAttendance = async () => {
    return await prisma.attendance.findMany({
        include: { student: true, class: true },
    });
};

const getAttendanceById = async (id) => {
    return await prisma.attendance.findUnique({
        where: { id: parseInt(id) },
        include: { student: true, class: true },
    });
};

export default {
    markAttendance,
    getAllAttendance,
    getAttendanceById,
};