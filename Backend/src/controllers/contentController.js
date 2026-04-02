import multer from 'multer';
import { validationResult, body, param } from 'express-validator';
import { uploadToWasabi, generateSignedUrl } from '../config/fileConfig.js';
import fileService from '../services/fileService.js';
import contentService from '../services/contentService.js';

const contentUpload = multer({ storage: multer.memoryStorage() });

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Create content
const createContent = [
    contentUpload.array('files', 5),

    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer').toInt(),
    body('assignedDate').isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),
    body('uploader_id').isInt().withMessage('Uploader ID must be a valid integer').toInt(), // Validate uploader_id

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { title, description, urls, class_id, assignedDate, uploader_id } = req.body;

        try {
            const uploadedFiles = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const fileKey = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
                    await uploadToWasabi({ file, fileKey });
                    const savedFile = await fileService.uploadFile({
                        key: fileKey,
                        uploaded_by: parseInt(uploader_id), // Pass the uploader ID
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                    });
                    uploadedFiles.push(savedFile);
                }
            }

            const newContent = await contentService.createContent({
                title,
                description,
                urls,
                class_id,
                assignedDate: new Date(assignedDate),
                files: uploadedFiles.map((file) => ({ id: file.id })), // Attach file IDs to the content
            });

            res.status(201).json({
                ...newContent,
                files: uploadedFiles,
            });
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Get all content
const getAllContent = async (req, res) => {
    try {
        const contents = await contentService.getAllContent();

        const contentsWithSignedUrls = await Promise.all(
            contents.map(async (content) => {
                const filesWithSignedUrls = await Promise.all(
                    content.files.map(async (file) => {
                        const signedUrl = await generateSignedUrl(file.key);
                        return { ...file, signedUrl };
                    })
                );
                return { ...content, files: filesWithSignedUrls };
            })
        );

        res.status(200).json(contentsWithSignedUrls);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get content by ID
const getContentById = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            const content = await contentService.getContentById(parseInt(id));
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            const filesWithSignedUrls = await Promise.all(
                content.files.map(async (file) => {
                    const signedUrl = await generateSignedUrl(file.key);
                    return { ...file, signedUrl };
                })
            );

            res.status(200).json({
                ...content,
                files: filesWithSignedUrls,
            });
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Update content
const updateContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('urls').optional().isArray().withMessage('URLs must be an array'),
    body('class_id').optional().isInt().withMessage('Class ID must be a valid integer'),
    body('assignedDate').optional().isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;
        const { title, description, urls, class_id, assignedDate } = req.body;

        try {
            const updatedContent = await contentService.updateContent(parseInt(id), {
                title,
                description,
                urls,
                class_id,
                assignedDate: assignedDate ? new Date(assignedDate) : undefined,
            });

            res.status(200).json(updatedContent);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Delete content
const deleteContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            await contentService.deleteContent(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Get contents by class ID
const getContentsByClassId = [
    // Validation rules
    param('classId').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { classId } = req.params;

        try {
            const contents = await contentService.getContentsByClassId(parseInt(classId));

            const contentsWithSignedUrls = await Promise.all(
                contents.map(async (content) => {
                    const filesWithSignedUrls = await Promise.all(
                        content.files.map(async (file) => {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file, signedUrl };
                        })
                    );
                    return { ...content, files: filesWithSignedUrls };
                })
            );

            res.status(200).json(contentsWithSignedUrls);
        } catch (error) {
            console.error('Error fetching contents by class ID:', error);
            res.status(500).json({ error: 'Failed to fetch contents' });
        }
    },
];

export default {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
    getContentsByClassId, // Export the new controller
};