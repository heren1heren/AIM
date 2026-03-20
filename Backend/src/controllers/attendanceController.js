import { validationResult, body, param } from 'express-validator';
import attendanceService from '../services/attendanceService.js';

// Mark attendance
const markAttendance = [
    // Validation rules
    body('student_id').isInt().withMessage('Student ID must be a valid integer'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('status').isString().isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).withMessage('Status must be one of: PRESENT, ABSENT, LATE, EXCUSED'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
    body('reason').optional().isString().withMessage('Reason must be a string'),
    body('marked_by').optional().isInt().withMessage('Marked by must be a valid teacher ID'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { student_id, class_id, date, status, comment, reason, marked_by } = req.body;

        try {
            const attendance = await attendanceService.markAttendance({
                student_id,
                class_id,
                date,
                status,
                comment,
                reason,
                marked_by,
            });

            res.status(201).json(attendance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to mark attendance' });
        }
    },
];

// Get all attendance records
const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await attendanceService.getAllAttendance();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
};

// Get attendance by ID
const getAttendanceById = [
    // Validation rules
    param('id').isInt().withMessage('Attendance ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const attendance = await attendanceService.getAttendanceById(parseInt(id));
            if (!attendance) {
                return res.status(404).json({ error: 'Attendance record not found' });
            }

            res.status(200).json(attendance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch attendance record' });
        }
    },
];

// Update attendance by ID
const updateAttendanceById = [
    // Validation rules
    param('id').isInt().withMessage('Attendance ID must be a valid integer'),
    body('status').optional().isString().isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).withMessage('Status must be one of: PRESENT, ABSENT, LATE, EXCUSED'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
    body('reason').optional().isString().withMessage('Reason must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status, comment, reason } = req.body;

        try {
            const updatedAttendance = await attendanceService.updateAttendanceById(parseInt(id), {
                status,
                comment,
                reason,
            });

            if (!updatedAttendance) {
                return res.status(404).json({ error: 'Attendance record not found' });
            }

            res.status(200).json(updatedAttendance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update attendance record' });
        }
    },
];

export default {
    markAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendanceById, // Ensure this is exported
};