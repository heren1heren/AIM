import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory where files will be stored locally
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Upload a file (store locally and create a database record)
const uploadFile = async (file, data) => {
    try {
        // Define the file path for local storage
        const filePath = path.join(UPLOADS_DIR, file.originalname);

        // Write the file to the local file system
        fs.writeFileSync(filePath, file.buffer);

        // Add the file path to the database record
        const fileData = {
            ...data,
            filename: file.originalname,
            filepath: filePath, // Store the local file path
            mimetype: file.mimetype,
            size: file.size,
        };

        // Create the file record in the database
        return await prisma.file.create({ data: fileData });
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

export default {
    uploadFile,
    getAllFiles,
    getFileById,
    deleteFile,
};