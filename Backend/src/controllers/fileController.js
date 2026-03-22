import { validationResult, body, param } from 'express-validator';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import fileService from '../services/fileService.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // Limit file size to 500 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/zip', // .zip
            'application/pdf', // .pdf
            'video/mp4', // .mp4
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'image/png', // .png
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .zip, .pdf, .mp4, .doc, .docx, and .png files are allowed'));
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

// Helper function to generate a signed URL
const generateSignedUrl = async (fileUrl) => {
    // Extract the file key from the full URL
    const fileKey = fileUrl.split('/').pop();

    const params = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
    };
    const command = new GetObjectCommand(params);
    return await getSignedUrl(wasabiClient, command, { expiresIn: 24 * 60 * 60 }); // 24 hours
};

// Upload a file to Wasabi
const uploadToWasabi = async (file) => {
    const params = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`, // Unique file name
        Body: file.buffer, // File content
        ContentType: file.mimetype, // File MIME type
    };

    const command = new PutObjectCommand(params);
    await wasabiClient.send(command);

    // Return the full URL
    return `https://${process.env.WASABI_BUCKET_NAME}.${process.env.WASABI_ENDPOINT.replace('https://', '')}/${params.Key}`;
};

// Upload a file
const uploadFile = [
    upload.single('file'),
    async (req, res) => {
        try {
            // Check if a file was uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Upload the file to Wasabi
            const fileUrl = await uploadToWasabi(req.file);

            // Extract additional metadata
            const { uploaded_by } = req.body;

            // Save file metadata to the database
            const file = await fileService.uploadFile({
                url: fileUrl, // Save the full URL
                uploaded_by: parseInt(uploaded_by),
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            });

            // Return the file metadata and URL
            res.status(201).json(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Failed to upload file' });
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
                const signedUrl = await generateSignedUrl(file.url);
                return { ...file, signedUrl };
            })
        );

        res.status(200).json(filesWithSignedUrls);
    } catch (error) {
        console.error(error);
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
            const signedUrl = await generateSignedUrl(file.url);

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

export default {
    uploadFile,
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
};