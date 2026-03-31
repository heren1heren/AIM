import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const uploadFile = async (data) => {
    try {
        // Save file metadata to the database
        return await prisma.file.create({
            data: {
                key: data.key, // Store the file key
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

// Delete a file (remove from Wasabi and database)
const deleteFile = async (id) => {
    try {
        // Find the file in the database
        const file = await prisma.file.findUnique({ where: { id: parseInt(id) } });
        if (!file) {
            throw new Error('File not found');
        }

        // Delete the file from Wasabi
        if (file.key) {
            console.log(`Deleting private file with key: ${file.key}`);
            // Implement Wasabi deletion logic here
        }

        // Delete the file record from the database
        return await prisma.file.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete file');
    }
};

const uploadUserAvatar = async (userId, file) => {
    try {
        const fileKey = `${Date.now()}-${file.originalname}`;

        // Save the file metadata
        const savedFile = await prisma.file.create({
            data: {
                key: fileKey,
                uploaded_by: userId,
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            },
        });

        // Update the user's avatarKey
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                avatarKey: savedFile.key,
                updated_at: new Date(),
            },
        });

        return updatedUser;
    } catch (error) {
        console.error('Error uploading user avatar:', error);
        throw new Error('Failed to upload user avatar');
    }
};

export default {
    uploadFile,
    getAllFiles,
    getFileById,
    deleteFile,
    uploadUserAvatar,
};