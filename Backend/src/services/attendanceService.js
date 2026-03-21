import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const markAttendance = async (data) => {
    try {
        return await prisma.attendance.create({
            data: {
                student_id: data.student_id,
                class_id: data.class_id,
                date: data.date,
                status: data.status,
                comment: data.comment || null,
                reason: data.reason || null,
                marked_by: data.marked_by || null,
            },
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw new Error('Failed to mark attendance');
    }
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

const getAttendanceByClassId = async (classId) => {
    try {
        return await prisma.attendance.findMany({
            where: { class_id: classId },
            include: { student: true, class: true }, // Include related data if needed
        });
    } catch (error) {
        console.error(`Error fetching attendance for class ID ${classId}:`, error);
        throw new Error('Failed to fetch attendance records');
    }
};

const getAttendanceByStudentId = async (studentId) => {
    try {
        return await prisma.attendance.findMany({
            where: { student_id: studentId },
            include: { class: true }, // Include related data if needed
        });
    } catch (error) {
        console.error(`Error fetching attendance for student ID ${studentId}:`, error);
        throw new Error('Failed to fetch attendance records');
    }
};

const updateAttendanceById = async (id, data) => {
    try {
        return await prisma.attendance.update({
            where: { id: parseInt(id) },
            data: {
                status: data.status,
                comment: data.comment,
                reason: data.reason, // Allow updating the reason
            },
        });
    } catch (error) {
        console.error(`Error updating attendance with ID ${id}:`, error);
        throw new Error('Failed to update attendance');
    }
};

export default {
    markAttendance,
    getAllAttendance,
    getAttendanceById,
    getAttendanceByClassId,
    getAttendanceByStudentId,
    updateAttendanceById,
};