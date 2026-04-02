import multer from 'multer';
import { validationResult, body, param } from 'express-validator';
import { uploadToWasabi, generateSignedUrl } from '../config/fileConfig.js';
import fileService from '../services/fileService.js';
import assignmentService from '../services/assignmentService.js';

const assignmentUpload = multer({ storage: multer.memoryStorage() });

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Create an assignment
const createAssignment = [
    assignmentUpload.array('files', 5), // Handle multiple file uploads (max 5 files)
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer').toInt(),
    body('due_date').isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
    body('assignedDate').isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),
    body('uploader_id').isInt().withMessage('Uploader ID must be a valid integer').toInt(), // Validate uploader_id

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, class_id, due_date, assignedDate, uploader_id } = req.body;

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
                        uploaded_by: parseInt(uploader_id), // Associate the file with the uploader
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        size: file.size,
                    });

                    uploadedFiles.push(savedFile);
                }
            }

            // Create the assignment
            const assignment = await assignmentService.createAssignment({
                title,
                description,
                class_id,
                due_date: new Date(due_date),
                assignedDate: new Date(assignedDate),
                files: uploadedFiles.map((file) => ({ id: file.id })), // Attach file IDs to the assignment
            });

            res.status(201).json({
                ...assignment,
                files: uploadedFiles,
            });
        } catch (error) {
            console.error('Error creating assignment:', error);
            res.status(500).json({ error: 'Failed to create assignment' });
        }
    },
];

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAllAssignments();

        const assignmentsWithSignedUrls = await Promise.all(
            assignments.map(async (assignment) => {
                const filesWithSignedUrls = await Promise.all(
                    assignment.files.map(async (file) => {
                        const signedUrl = await generateSignedUrl(file.key);
                        return { ...file, signedUrl };
                    })
                );
                return { ...assignment, files: filesWithSignedUrls };
            })
        );

        res.status(200).json(assignmentsWithSignedUrls);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

const getAssignmentsByStudentId = [
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
            const assignments = await assignmentService.getAssignmentsByStudentId(parseInt(studentId));

            const assignmentsWithSignedUrls = await Promise.all(
                assignments.map(async (assignment) => {
                    const filesWithSignedUrls = await Promise.all(
                        assignment.files.map(async (file) => {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file, signedUrl };
                        })
                    );
                    return { ...assignment, files: filesWithSignedUrls };
                })
            );

            res.status(200).json(assignmentsWithSignedUrls);
        } catch (error) {
            console.error('Error fetching assignments by student ID:', error);
            res.status(500).json({ error: 'Failed to fetch assignments' });
        }
    },
];

// Get assignments by class ID
const getAssignmentsByClassId = [
    // Validation rules
    param('classId').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { classId } = req.params;

        try {
            const assignments = await assignmentService.getAssignmentsByClassId(parseInt(classId));

            const assignmentsWithSignedUrls = await Promise.all(
                assignments.map(async (assignment) => {
                    const filesWithSignedUrls = await Promise.all(
                        assignment.files.map(async (file) => {
                            const signedUrl = await generateSignedUrl(file.key);
                            return { ...file, signedUrl };
                        })
                    );
                    return { ...assignment, files: filesWithSignedUrls };
                })
            );

            res.status(200).json(assignmentsWithSignedUrls);
        } catch (error) {
            console.error('Error fetching assignments by class ID:', error);
            res.status(500).json({ error: 'Failed to fetch assignments by class ID' });
        }
    },
];

// Get an assignment by ID
const getAssignmentById = [
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            const assignment = await assignmentService.getAssignmentById(parseInt(id));
            if (!assignment) {
                return res.status(404).json({ error: 'Assignment not found' });
            }

            const filesWithSignedUrls = await Promise.all(
                assignment.files.map(async (file) => {
                    const signedUrl = await generateSignedUrl(file.key);
                    return { ...file, signedUrl };
                })
            );

            res.status(200).json({
                ...assignment,
                files: filesWithSignedUrls,
            });
        } catch (error) {
            console.error('Error fetching assignment:', error);
            res.status(500).json({ error: 'Failed to fetch assignment' });
        }
    },
];

// Update an assignment
const updateAssignment = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('due_date').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
    body('assignedDate').optional().isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;
        const { title, description, due_date, assignedDate } = req.body;

        try {
            const updatedAssignment = await assignmentService.updateAssignment(parseInt(id), {
                title,
                description,
                due_date: due_date ? new Date(due_date) : undefined,
                assignedDate: assignedDate ? new Date(assignedDate) : undefined,
            });

            res.status(200).json(updatedAssignment);
        } catch (error) {
            console.error('Error updating assignment:', error);
            res.status(500).json({ error: 'Failed to update assignment' });
        }
    },
];

// Delete an assignment
const deleteAssignment = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            await assignmentService.deleteAssignment(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting assignment:', error);
            res.status(500).json({ error: 'Failed to delete assignment' });
        }
    },
];

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentsByClassId,
    getAssignmentsByStudentId,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};