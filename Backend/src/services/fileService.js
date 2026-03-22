import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();


// Upload a file (store locally and create a database record)
const uploadFile = async (data) => {
    try {
        // Save file metadata to the database
        return await prisma.file.create({
            data: {
                url: data.url,
                uploaded_by: data.uploaded_by,
                filename: data.filename,
                mimetype: data.mimetype,
                size: data.size,
            },
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
};

// Get all files
const getAllFiles = async () => {
    return await prisma.file.findMany({
        include: { uploader: true },
    });
};

// Get a file by ID
const getFileById = async (id) => {
    return await prisma.file.findUnique({
        where: { id: parseInt(id) },
        include: { uploader: true },
    });
};

// Delete a file (remove from local storage and database)
const deleteFile = async (id) => {
    try {
        // Find the file in the database
        const file = await prisma.file.findUnique({ where: { id: parseInt(id) } });
        if (!file) {
            throw new Error('File not found');
        }

        // Delete the file from the local file system
        if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
        }

        // Delete the file record from the database
        return await prisma.file.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete file');
    }
};

// Get files by content_id
const getFilesByContentId = async (contentId) => {
    return await prisma.file.findMany({
        where: { content_id: parseInt(contentId) },
        include: { uploader: true },
    });
};

// Get files by assignment_id
const getFilesByAssignmentId = async (assignmentId) => {
    return await prisma.file.findMany({
        where: { assignment_id: parseInt(assignmentId) },
        include: { uploader: true },
    });
};

// Get files by submission_id
const getFilesBySubmissionId = async (submissionId) => {
    return await prisma.file.findMany({
        where: { submission_id: parseInt(submissionId) },
        include: { uploader: true },
    });
};

// Get files by class_id
const getFilesByClassId = async (classId) => {
    return await prisma.file.findMany({
        where: { class_id: parseInt(classId) },
        include: { uploader: true },
    });
};

// Get files by notification_id
const getFilesByNotificationId = async (notificationId) => {
    return await prisma.file.findMany({
        where: { notification_id: parseInt(notificationId) },
        include: { uploader: true },
    });
};

// Update files by Submission ID
const updateFilesBySubmissionId = async (submissionId, fileIds) => {
    try {
        return await prisma.file.updateMany({
            where: { id: { in: fileIds } },
            data: { submission_id: submissionId },
        });
    } catch (error) {
        console.error('Error updating files by submission ID:', error);
        throw new Error('Failed to update files by submission ID');
    }
};

// Update file by Content ID
const updateFileByContentId = async (contentId, fileId) => {
    try {
        return await prisma.file.update({
            where: { id: fileId },
            data: { content_id: contentId },
        });
    } catch (error) {
        console.error('Error updating file by content ID:', error);
        throw new Error('Failed to update file by content ID');
    }
};

// Update file by Notification ID
const updateFileByNotificationId = async (notificationId, fileId) => {
    try {
        return await prisma.file.update({
            where: { id: fileId },
            data: { notification_id: notificationId },
        });
    } catch (error) {
        console.error('Error updating file by notification ID:', error);
        throw new Error('Failed to update file by notification ID');
    }
};

// Update file by Assignment ID
const updateFileByAssignmentId = async (assignmentId, fileId) => {
    try {
        return await prisma.file.update({
            where: { id: fileId },
            data: { assignment_id: assignmentId },
        });
    } catch (error) {
        console.error('Error updating file by assignment ID:', error);
        throw new Error('Failed to update file by assignment ID');
    }
};

export default {
    uploadFile,
    getAllFiles,
    getFileById,
    deleteFile,
    getFilesByContentId,
    getFilesByAssignmentId,
    getFilesBySubmissionId,
    getFilesByClassId,
    getFilesByNotificationId,
    updateFilesBySubmissionId,
    updateFileByContentId,
    updateFileByNotificationId,
    updateFileByAssignmentId,
};