import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendanceById);
export default router;