import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Multer Configuration
const memoryStorage = multer.memoryStorage();

const createMulterUpload = (allowedTypes, fileSizeLimit) => {
    return multer({
        storage: memoryStorage,
        limits: {
            fileSize: fileSizeLimit, // File size limit in bytes
        },
        fileFilter: (req, file, cb) => {
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new Error(`Only the following file types are allowed: ${allowedTypes.join(', ')}`));
            }
            cb(null, true);
        },
    });
};

// General file upload (e.g., documents, videos, etc.)
export const generalUpload = createMulterUpload(
    [
        'application/zip',
        'application/pdf',
        'video/mp4',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
    ],
    500 * 1024 * 1024 // 500 MB
);

// Avatar file upload (e.g., profile pictures)
export const avatarUpload = createMulterUpload(
    ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    5 * 1024 * 1024 // 5 MB
);

// Wasabi S3 Configuration
const wasabiClient = new S3Client({
    region: process.env.WASABI_REGION,
    endpoint: process.env.WASABI_ENDPOINT,
    credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY,
        secretAccessKey: process.env.WASABI_SECRET_KEY,
    },
});

// Upload a file to Wasabi
export const uploadToWasabi = async ({ file, fileKey }) => {
    try {
        const params = {
            Bucket: process.env.WASABI_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await wasabiClient.send(command);

        console.log(`File uploaded successfully: ${fileKey}`);
        return fileKey;
    } catch (error) {
        console.error('Error uploading file to Wasabi:', error);
        throw new Error('Failed to upload file to Wasabi');
    }
};

// Generate a signed URL for accessing private files
export const generateSignedUrl = async (fileKey) => {
    try {
        const params = {
            Bucket: process.env.WASABI_BUCKET_NAME,
            Key: fileKey,
        };
        const command = new GetObjectCommand(params);
        return await getSignedUrl(wasabiClient, command, { expiresIn: 24 * 60 * 60 }); // 24 hours
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Failed to generate signed URL');
    }
};