import express from 'express';
import passport from 'passport';
import attendanceController from '../controllers/attendanceController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher']), attendanceController.markAttendance); // Only admin and teacher can mark attendance
router.get('/', authorize(['admin', 'teacher']), attendanceController.getAllAttendance); // Only admin and teacher can get all attendance records
router.get('/class/:classId', authorize(['admin', 'teacher', 'student']), attendanceController.getAttendanceByClassId); // Admin, teacher, and student can get attendance by class ID
router.get('/student/:studentId', authorize(['admin', 'teacher', 'student']), attendanceController.getAttendanceByStudentId); // Admin, teacher, and student can get attendance by student ID
router.get('/:id', authorize(['admin', 'teacher', 'student']), attendanceController.getAttendanceById); // Admin, teacher, and student can get attendance by ID
router.put('/:id', authorize(['admin', 'teacher']), attendanceController.updateAttendanceById); // Only admin and teacher can update attendance by ID

export default router;