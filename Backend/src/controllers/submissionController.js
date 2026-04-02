import multer from 'multer';
import { uploadToWasabi, generateSignedUrl } from '../config/fileConfig.js';
import fileService from '../services/fileService.js';
import submissionService from '../services/submissionService.js';
import { validationResult, body, param } from 'express-validator';

const submissionUpload = multer({ storage: multer.memoryStorage() });

// Create a submission
const createSubmission = [
    submissionUpload.array('files', 5),
    body('assignment_id').isInt().withMessage('Assignment ID must be a valid integer').toInt(),
    body('student_id').isInt().withMessage('Student ID must be a valid integer').toInt(),
    body('content').isString().notEmpty().withMessage('Content is required and must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignment_id, student_id, content } = req.body;

        try {
            const uploadedFiles = [];

            // If files are uploaded, handle the file uploads
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const fileKey = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

                    // Upload the file to Wasabi
                    await uploadToWasabi({ file, fileKey });

                    // Save the file metadata in the database
                    const savedFile = await fileService.uploadFile({
                        key: fileKey,
                        uploaded_by: student_id, // Associate the file with the student
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                    });

                    uploadedFiles.push(savedFile);
                }
            }

            // Create the submission
            const submission = await submissionService.createSubmission({
                assignment_id,
                student_id,
                content,
                files: uploadedFiles.map((file) => ({ id: file.id })), // Attach file IDs to the submission
            });

            res.status(201).json({
                ...submission,
                files: uploadedFiles,
            });
        } catch (error) {
            console.error('Error creating submission:', error);
            res.status(500).json({ error: 'Failed to create submission' });
        }
    },
];

// Get all submissions
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await submissionService.getAllSubmissions();

        const submissionsWithSignedUrls = await Promise.all(
            submissions.map(async (submission) => {
                const filesWithSignedUrls = await Promise.all(
                    submission.files.map(async (file) => {
                        const signedUrl = await generateSignedUrl(file.key);
                        return { ...file, signedUrl };
                    })
                );
                return { ...submission, files: filesWithSignedUrls };
            })
        );

        res.status(200).json(submissionsWithSignedUrls);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

// Get a submission by ID
const getSubmissionById = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const submission = await submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                return res.status(404).json({ error: 'Submission not found' });
            }

            const filesWithSignedUrls = await Promise.all(
                submission.files.map(async (file) => {
                    const signedUrl = await generateSignedUrl(file.key);
                    return { ...file, signedUrl };
                })
            );

            res.status(200).json({
                ...submission,
                files: filesWithSignedUrls,
            });
        } catch (error) {
            console.error('Error fetching submission:', error);
            res.status(500).json({ error: 'Failed to fetch submission' });
        }
    },
];

// Update a submission
const updateSubmission = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),
    body('content').optional().isString().withMessage('Content must be a string'),
    body('grade').optional().isInt().withMessage('Grade must be a valid integer'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { content, grade, feedback } = req.body;

        try {
            const updatedSubmission = await submissionService.updateSubmission(parseInt(id), {
                content,
                grade,
                feedback,
            });

            res.status(200).json(updatedSubmission);
        } catch (error) {
            console.error('Error updating submission:', error);
            res.status(500).json({ error: 'Failed to update submission' });
        }
    },
];

// Delete a submission
const deleteSubmission = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await submissionService.deleteSubmission(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting submission:', error);
            res.status(500).json({ error: 'Failed to delete submission' });
        }
    },
];

// Get submissions by student ID
const getSubmissionsByStudentId = [
    // Validation rules
    param('studentId').isInt().withMessage('Student ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { studentId } = req.params;

        try {
            const submissions = await submissionService.getSubmissionsByStudentId(parseInt(studentId));

            const submissionsWithSignedUrls = await Promise.all(
                submissions.map(async (submission) => {
                    const filesWithSignedUrls = await Promise.all(
                        submission.files.map(async (file) => {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file, signedUrl };
                        })
                    );
                    return { ...submission, files: filesWithSignedUrls };
                })
            );

            res.status(200).json(submissionsWithSignedUrls);
        } catch (error) {
            console.error('Error fetching submissions for the student:', error);
            res.status(500).json({ error: 'Failed to fetch submissions for the student' });
        }
    },
];

// Get submissions by assignment ID
const getSubmissionsByAssignmentId = [
    // Validation rules
    param('assignmentId').isInt().withMessage('Assignment ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignmentId } = req.params;

        try {
            const submissions = await submissionService.getSubmissionsByAssignmentId(parseInt(assignmentId));

            const submissionsWithSignedUrls = await Promise.all(
                submissions.map(async (submission) => {
                    const filesWithSignedUrls = await Promise.all(
                        submission.files.map(async (file) => {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file, signedUrl };
                        })
                    );
                    return { ...submission, files: filesWithSignedUrls };
                })
            );

            res.status(200).json(submissionsWithSignedUrls);
        } catch (error) {
            console.error('Error fetching submissions for the assignment:', error);
            res.status(500).json({ error: 'Failed to fetch submissions for the assignment' });
        }
    },
];

export default {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission,
    getSubmissionsByStudentId,
    getSubmissionsByAssignmentId,
};