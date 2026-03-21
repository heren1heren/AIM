import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAllAttendance);
router.get('/class/:classId', attendanceController.getAttendanceByClassId);
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendanceById);

export default router;