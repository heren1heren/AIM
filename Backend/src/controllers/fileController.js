import { validationResult, body, param, query } from 'express-validator';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import fileService from '../services/fileService.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/zip', // .zip
            'application/pdf', // .pdf
            'video/mp4', // .mp4
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'image/png', // .png
            'image/jpeg', // .jpg, .jpeg
            'image/jpg', // .jpg
            'image/gif', // .gif
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .zip, .pdf, .mp4, .doc, .docx, .png, .jpg, .jpeg, and .gif files are allowed'));
        }
        cb(null, true);
    },
});

// Multer configuration for avatar uploads
const avatarUpload = multer({
    storage: multer.memoryStorage(), // Use memory storage
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed for avatars'));
        }
        cb(null, true);
    },
});

// Configure Wasabi S3 Client
const wasabiClient = new S3Client({
    region: process.env.WASABI_REGION,
    endpoint: process.env.WASABI_ENDPOINT,
    credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY,
        secretAccessKey: process.env.WASABI_SECRET_KEY,
    },
});

// Generate a signed URL for accessing private files
const generateSignedUrl = async (fileKey) => {
    const params = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
    };
    const command = new GetObjectCommand(params);
    return await getSignedUrl(wasabiClient, command, { expiresIn: 24 * 60 * 60 });
};

// Upload a file to Wasabi
const uploadToWasabi = async ({ file, fileKey }) => {
    const params = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await wasabiClient.send(command);

    return fileKey;
};


const uploadFile = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            let fileKey = `${Date.now()}-${req.file.originalname}`;
            fileKey = fileKey.replace(/\s+/g, '-'); // Replace spaces with hyphens

            const sanitizedKey = await uploadToWasabi({ file: req.file, fileKey });

            const file = await fileService.uploadFile({
                key: sanitizedKey,
                uploaded_by: req.user.id,
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            });

            res.status(201).json(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Failed to upload file' });
        }
    },
];

// Upload avatar file
const uploadAvatarFile = [
    avatarUpload.single('avatar'),
    async (req, res) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No avatar file uploaded' });
            }

            // Use fileService.uploadUserAvatar to handle both file upload and user update
            const updatedUser = await fileService.uploadUserAvatar(req.user.id, file);

            res.status(201).json({
                message: 'Avatar uploaded successfully',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Error uploading avatar file:', error);
            res.status(500).json({ error: 'Failed to upload avatar file' });
        }
    },
];

// Get all files
const getAllFiles = async (req, res) => {
    try {
        const files = await fileService.getAllFiles();

        // Generate signed URLs for all files
        const filesWithSignedUrls = await Promise.all(
            files.map(async (file) => {
                const signedUrl = await generateSignedUrl(file.key);
                return { ...file, signedUrl };
            })
        );

        res.status(200).json(filesWithSignedUrls);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// Get a file by ID
const getFileById = [
    param('id').isInt().withMessage('File ID must be a valid integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const file = await fileService.getFileById(parseInt(id));
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Generate a signed URL for the file
            const signedUrl = await generateSignedUrl(file.key);

            res.status(200).json({ ...file, signedUrl });
        } catch (error) {
            console.error('Error fetching file:', error);
            res.status(500).json({ error: 'Failed to fetch file' });
        }
    },
];

// Delete a file
const deleteFile = [
    param('id').isInt().withMessage('File ID must be a valid integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await fileService.deleteFile(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete file' });
        }
    },
];

// Get files by content ID
const getFilesByContentId = async (req, res) => {
    try {
        const files = await fileService.getFilesByContentId(req.params.contentId);

        // Generate signed URLs for all files
        const filesWithSignedUrls = await Promise.all(
            files.map(async (file) => {
                const signedUrl = await generateSignedUrl(file.url);
                return { ...file, signedUrl };
            })
        );

        res.status(200).json(filesWithSignedUrls);
    } catch (error) {
        console.error('Error fetching files by content ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// Update files by Submission ID
const updateFilesBySubmissionId = [
    param('submissionId').isInt().withMessage('Submission ID must be a valid integer'),
    body('fileIds').isArray().withMessage('fileIds must be an array of file IDs'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { submissionId } = req.params;
        const { fileIds } = req.body;

        try {
            const updatedFiles = await fileService.updateFilesBySubmissionId(parseInt(submissionId), fileIds);
            res.status(200).json(updatedFiles);
        } catch (error) {
            console.error('Error updating files by submission ID:', error);
            res.status(500).json({ error: 'Failed to update files by submission ID' });
        }
    },
];

// Update file by Content ID
const updateFileByContentId = [
    param('contentId').isInt().withMessage('Content ID must be a valid integer'),
    body('fileId').isInt().withMessage('fileId must be a valid integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { contentId } = req.params;
        const { fileId } = req.body;

        try {
            const updatedFile = await fileService.updateFileByContentId(parseInt(contentId), parseInt(fileId));
            res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error updating file by content ID:', error);
            res.status(500).json({ error: 'Failed to update file by content ID' });
        }
    },
];

// Update file by Notification ID
const updateFileByNotificationId = [
    param('notificationId').isInt().withMessage('Notification ID must be a valid integer'),
    body('fileId').isInt().withMessage('fileId must be a valid integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { notificationId } = req.params;
        const { fileId } = req.body;

        try {
            const updatedFile = await fileService.updateFileByNotificationId(parseInt(notificationId), parseInt(fileId));
            res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error updating file by notification ID:', error);
            res.status(500).json({ error: 'Failed to update file by notification ID' });
        }
    },
];

// Update file by Assignment ID
const updateFileByAssignmentId = [
    param('assignmentId').isInt().withMessage('Assignment ID must be a valid integer'),
    body('fileId').isInt().withMessage('fileId must be a valid integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignmentId } = req.params;
        const { fileId } = req.body;

        try {
            const updatedFile = await fileService.updateFileByAssignmentId(parseInt(assignmentId), parseInt(fileId));
            res.status(200).json(updatedFile);
        } catch (error) {
            console.error('Error updating file by assignment ID:', error);
            res.status(500).json({ error: 'Failed to update file by assignment ID' });
        }
    },
];

// Get file access by file key
const getFileAccessByFileKey = [
    query('fileKey').isString().withMessage('File key must be provided'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fileKey } = req.query;

        try {
            const expiresIn = 24 * 60 * 60; // 24 hours in seconds
            const signedUrl = await generateSignedUrl(fileKey);
            const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

            res.status(200).json({
                signedUrl,
                expiresAt,
            });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(500).json({ error: 'Failed to generate signed URL' });
        }
    },
];

export default {
    uploadFile,
    uploadAvatarFile,
    getAllFiles,
    getFileById,
    deleteFile,
    getFilesByContentId,
    getFilesByAssignmentId: getFilesByContentId,
    getFilesBySubmissionId: getFilesByContentId,
    getFilesByClassId: getFilesByContentId,
    getFilesByNotificationId: getFilesByContentId,
    updateFilesBySubmissionId,
    updateFileByContentId,
    updateFileByNotificationId,
    updateFileByAssignmentId,
    getFileAccessByFileKey,
};