import { PrismaClient } from '@prisma/client';
import userService from './userService.js';

const prisma = new PrismaClient();

const createClass = async (data) => {
    const { student_ids, ...classData } = data;

    try {
        if (student_ids && student_ids.length > 0) {
            const existingStudents = await prisma.student.findMany({
                where: { id: { in: student_ids } },
                select: { id: true },
            });

            const existingStudentIds = existingStudents.map((student) => student.id);

            const missingStudentIds = student_ids.filter((id) => !existingStudentIds.includes(id));
            if (missingStudentIds.length > 0) {
                throw new Error(`The following student IDs do not exist: ${missingStudentIds.join(', ')}`);
            }
        }

        const newClass = await prisma.class.create({
            data: {
                ...classData,
                students: student_ids && student_ids.length > 0
                    ? {
                        connect: student_ids.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: { students: true, teacher: true },
        });

        return { class: newClass };
    } catch (error) {
        console.error('Error creating class:', error);
        throw new Error('Failed to create class');
    }
};

const getAllClasses = async () => {
    try {
        const classes = await prisma.class.findMany({
            include: {
                teacher: {
                    include: { user: { select: { name: true } } },
                },
                students: true,
            },
        });

        return classes.map((classItem) => ({
            ...classItem,
            teacher: {
                id: classItem.teacher.id,
                user_id: classItem.teacher.user_id,
                name: classItem.teacher.user.name,
            },
        }));
    } catch (error) {
        throw new Error('Failed to fetch classes');
    }
};

const getClassById = async (id) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: { id: parseInt(id) },
            include: {
                teacher: {
                    include: { user: { select: { name: true } } },
                },
                students: true,
            },
        });

        if (!classItem) {
            throw new Error('Class not found');
        }

        return {
            ...classItem,
            teacher: {
                id: classItem.teacher.id,
                user_id: classItem.teacher.user_id,
                name: classItem.teacher.user.name,
            },
        };
    } catch (error) {
        throw new Error('Failed to fetch class');
    }
};

const updateClass = async (id, data) => {
    const { student_ids, ...classData } = data;

    try {
        let invalidStudentIds = [];
        let duplicateStudentIds = [];

        if (student_ids && student_ids.length > 0) {
            const uniqueStudentIds = new Set(student_ids);
            duplicateStudentIds = student_ids.filter((id, index) => student_ids.indexOf(id) !== index);

            const existingStudents = await prisma.student.findMany({
                where: { id: { in: Array.from(uniqueStudentIds) } },
                select: { id: true },
            });

            const existingStudentIds = existingStudents.map((student) => student.id);
            invalidStudentIds = Array.from(uniqueStudentIds).filter((id) => !existingStudentIds.includes(id));
        }

        const updatedClass = await prisma.class.update({
            where: { id: parseInt(id) },
            data: {
                ...classData,
                students: student_ids && student_ids.length > 0
                    ? {
                        set: [],
                        connect: student_ids
                            .filter((id) => !invalidStudentIds.includes(id))
                            .map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: { students: true, teacher: true },
        });

        const teacher = await userService.getUserById(updatedClass.teacher.user_id);

        return {
            class: {
                ...updatedClass,
                teacherName: teacher ? teacher.name : null,
            },
            invalidStudentIds,
            duplicateStudentIds,
        };
    } catch (error) {
        console.error(`Error updating class with ID ${id}:`, error);
        throw new Error('Failed to update class');
    }
};

const deleteClass = async (id) => {
    try {
        const classExists = await prisma.class.findUnique({
            where: { id },
        });

        if (!classExists) {
            throw new Error('Class not found');
        }

        await prisma.attendance.deleteMany({
            where: { class_id: id },
        });

        const assignments = await prisma.assignment.findMany({
            where: { class_id: id },
            select: { id: true },
        });

        const assignmentIds = assignments.map((assignment) => assignment.id);

        if (assignmentIds.length > 0) {
            await prisma.submission.deleteMany({
                where: { assignment_id: { in: assignmentIds } },
            });

            await prisma.assignment.deleteMany({
                where: { id: { in: assignmentIds } },
            });
        }

        await prisma.content.deleteMany({
            where: { class_id: id },
        });

        await prisma.file.updateMany({
            where: { class_id: id },
            data: { class_id: null },
        });

        await prisma.student.updateMany({
            where: { class_id: id },
            data: { class_id: null },
        });

        const notifications = await prisma.notification.findMany({
            where: {
                classes: {
                    some: { id },
                },
            },
            select: { id: true },
        });

        const notificationIds = notifications.map((notification) => notification.id);

        if (notificationIds.length > 0) {
            await prisma.notificationTarget.deleteMany({
                where: { notification_id: { in: notificationIds } },
            });

            await prisma.notification.deleteMany({
                where: { id: { in: notificationIds } },
            });
        }

        await prisma.class.delete({
            where: { id },
        });

        return { message: `Class with ID ${id} and all related data have been deleted.` };
    } catch (error) {
        console.error(`Error deleting class with ID ${id}:`, error);
        throw new Error('Failed to delete class and related data');
    }
};

const transferDataClass = async (sourceClassId, newClassId) => {
    try {
        const contents = await prisma.content.findMany({
            where: { class_id: sourceClassId },
        });

        for (const content of contents) {
            await prisma.content.create({
                data: {
                    title: content.title,
                    description: content.description,
                    urls: content.urls,
                    class_id: newClassId,
                },
            });
        }

        const files = await prisma.file.findMany({
            where: { class_id: sourceClassId },
        });

        for (const file of files) {
            await prisma.file.create({
                data: {
                    url: file.url,
                    filename: file.filename,
                    mimetype: file.mimetype,
                    size: file.size,
                    uploaded_by: file.uploaded_by,
                    class_id: newClassId,
                },
            });
        }

        return { message: `Data transferred from class ${sourceClassId} to class ${newClassId}` };
    } catch (error) {
        console.error(`Error transferring data from class ${sourceClassId} to class ${newClassId}:`, error);
        throw new Error('Failed to transfer data between classes');
    }
};

export default {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    transferDataClass,
};