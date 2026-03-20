import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createClass = async (data) => {
    const { student_ids, ...classData } = data;

    try {
        // Validate that all student IDs exist
        if (student_ids && student_ids.length > 0) {
            const existingStudents = await prisma.student.findMany({
                where: { id: { in: student_ids } },
                select: { id: true },
            });

            const existingStudentIds = existingStudents.map((student) => student.id);

            // Check for missing student IDs
            const missingStudentIds = student_ids.filter((id) => !existingStudentIds.includes(id));
            if (missingStudentIds.length > 0) {
                throw new Error(`The following student IDs do not exist: ${missingStudentIds.join(', ')}`);
            }
        }

        // Create the class and associate students
        const newClass = await prisma.class.create({
            data: {
                ...classData,
                students: student_ids && student_ids.length > 0
                    ? {
                        connect: student_ids.map((id) => ({ id })), // Connect students by their IDs
                    }
                    : undefined,
            },
            include: { students: true }, // Include students in the response
        });

        return { class: newClass };
    } catch (error) {
        console.error('Error creating class:', error);
        throw new Error('Failed to create class');
    }
};

const getAllClasses = async () => {
    try {
        return await prisma.class.findMany({
            include: { teacher: true, students: true },
        });
    } catch (error) {
        console.error('Error fetching all classes:', error);
        throw new Error('Failed to fetch classes');
    }
};

const getClassById = async (id) => {
    try {
        return await prisma.class.findUnique({
            where: { id: parseInt(id) },
            include: { teacher: true, students: true },
        });
    } catch (error) {
        console.error(`Error fetching class with ID ${id}:`, error);
        throw new Error('Failed to fetch class');
    }
};

const updateClass = async (id, data) => {
    const { student_ids, ...classData } = data;

    try {
        let invalidStudentIds = [];
        let duplicateStudentIds = [];

        // Validate student IDs if provided
        if (student_ids && student_ids.length > 0) {
            // Check for duplicate student IDs
            const uniqueStudentIds = new Set(student_ids);
            duplicateStudentIds = student_ids.filter((id, index) => student_ids.indexOf(id) !== index);

            // Check for invalid student IDs
            const existingStudents = await prisma.student.findMany({
                where: { id: { in: Array.from(uniqueStudentIds) } },
                select: { id: true },
            });

            const existingStudentIds = existingStudents.map((student) => student.id);
            invalidStudentIds = Array.from(uniqueStudentIds).filter((id) => !existingStudentIds.includes(id));
        }

        // Update the class and associate valid students
        const updatedClass = await prisma.class.update({
            where: { id: parseInt(id) },
            data: {
                ...classData,
                students: student_ids && student_ids.length > 0
                    ? {
                        set: [], // Clear existing students
                        connect: student_ids
                            .filter((id) => !invalidStudentIds.includes(id)) // Only connect valid IDs
                            .map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: { students: true }, // Include students in the response
        });

        return {
            class: updatedClass,
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
        // Check if the class exists
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
            // Delete submissions related to assignments
            await prisma.submission.deleteMany({
                where: { assignment_id: { in: assignmentIds } },
            });

            // Delete assignments
            await prisma.assignment.deleteMany({
                where: { id: { in: assignmentIds } },
            });
        }

        // Step 3: Delete related content
        await prisma.content.deleteMany({
            where: { class_id: id },
        });

        // Step 4: Disassociate files
        await prisma.file.updateMany({
            where: { class_id: id },
            data: { class_id: null }, // Disassociate files from the class
        });

        // Step 5: Remove students from the class
        await prisma.student.updateMany({
            where: { class_id: id },
            data: { class_id: null }, // Unassign students from the class
        });

        // Step 6: Delete notifications related to the class
        const notifications = await prisma.notification.findMany({
            where: { class_id: id },
            select: { id: true },
        });

        const notificationIds = notifications.map((notification) => notification.id);

        if (notificationIds.length > 0) {
            // Delete notification targets
            await prisma.notificationTarget.deleteMany({
                where: { notification_id: { in: notificationIds } },
            });

            // Delete notifications
            await prisma.notification.deleteMany({
                where: { id: { in: notificationIds } },
            });
        }

        // Finally, delete the class
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
        // Step 1: Clone content from the source class to the new class
        const contents = await prisma.content.findMany({
            where: { class_id: sourceClassId },
        });

        for (const content of contents) {
            await prisma.content.create({
                data: {
                    title: content.title,
                    description: content.description,
                    urls: content.urls,
                    class_id: newClassId, // Associate with the new class
                },
            });
        }

        // Step 2: Clone files from the source class to the new class
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
                    class_id: newClassId, // Associate with the new class
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