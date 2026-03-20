import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createClass = async (data) => {
    const { student_ids, ...classData } = data;

    try {
        let invalidStudentIds = [];
        let validStudentIds = [];

        // Validate student IDs
        if (student_ids && student_ids.length > 0) {
            const validStudents = await prisma.student.findMany({
                where: { id: { in: student_ids } },
                select: { id: true },
            });

            validStudentIds = validStudents.map((student) => student.id);
            invalidStudentIds = student_ids.filter((id) => !validStudentIds.includes(id));
        }

        // Create the class and associate valid students
        const newClass = await prisma.class.create({
            data: {
                ...classData,
                students: validStudentIds.length
                    ? {
                          connect: validStudentIds.map((id) => ({ id })),
                      }
                    : undefined,
            },
            include: { students: true },
        });

        return {
            class: newClass,
            invalidStudentIds,
        };
    } catch (error) {
        console.error('Error creating class:', error);
        throw new Error('Failed to create class');
    }
};

const updateClass = async (id, data) => {
    const { student_ids, ...classData } = data;

    try {
        let invalidStudentIds = [];
        let duplicateStudentIds = [];
        let validStudentIds = [];

        // Validate student IDs
        if (student_ids && student_ids.length > 0) {
            const validStudents = await prisma.student.findMany({
                where: { id: { in: student_ids } },
                select: { id: true },
            });

            validStudentIds = validStudents.map((student) => student.id);
            invalidStudentIds = student_ids.filter((id) => !validStudentIds.includes(id));

            // Check for duplicate student IDs
            const existingStudents = await prisma.class.findUnique({
                where: { id },
                select: { students: { select: { id: true } } },
            });

            const existingStudentIds = existingStudents.students.map((student) => student.id);
            duplicateStudentIds = validStudentIds.filter((id) => existingStudentIds.includes(id));

            // Remove duplicates from the valid list
            validStudentIds = validStudentIds.filter((id) => !duplicateStudentIds.includes(id));
        }

        // Update the class and associate valid students
        const updatedClass = await prisma.class.update({
            where: { id },
            data: {
                ...classData,
                students: validStudentIds.length
                    ? {
                          set: validStudentIds.map((id) => ({ id })), // Replace existing students with the new list
                      }
                    : undefined,
            },
            include: { students: true },
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

export default {
    createClass,
    getAllClasses: async () => {
        try {
            return await prisma.class.findMany({
                include: { teacher: true, students: true },
            });
        } catch (error) {
            console.error('Error fetching all classes:', error);
            throw new Error('Failed to fetch classes');
        }
    },
    getClassById: async (id) => {
        try {
            return await prisma.class.findUnique({
                where: { id: parseInt(id) },
                include: { teacher: true, students: true },
            });
        } catch (error) {
            console.error(`Error fetching class with ID ${id}:`, error);
            throw new Error('Failed to fetch class');
        }
    },
    updateClass,
    deleteClass: async (id) => {
        try {
            return await prisma.class.delete({ where: { id: parseInt(id) } });
        } catch (error) {
            console.error(`Error deleting class with ID ${id}:`, error);
            throw new Error('Failed to delete class');
        }
    },
    transferDataClass: async (sourceClassId, newClassId) => {
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
    },
};