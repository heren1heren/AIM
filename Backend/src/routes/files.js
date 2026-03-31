import express from 'express';
import passport from 'passport';
import fileController from '../controllers/fileController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', authorize(['admin', 'teacher', 'student']), fileController.uploadFile);
router.get('/', authorize(['admin', 'teacher']), fileController.getAllFiles);
router.get('/access', authorize(['admin', 'teacher', 'student']), fileController.getFileAccessByFileKey);
router.get('/:id', authorize(['admin', 'teacher', 'student']), fileController.getFileById);
router.delete('/:id', authorize(['admin']), fileController.deleteFile);

router.get('/content/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByContentId);
router.get('/assignment/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByAssignmentId);
router.get('/submission/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesBySubmissionId);
router.get('/class/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByClassId);
router.get('/notification/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByNotificationId);

router.put('/submission/:submissionId', authorize(['admin', 'teacher']), fileController.updateFilesBySubmissionId);
router.put('/content/:contentId', authorize(['admin', 'teacher']), fileController.updateFileByContentId);
router.put('/notification/:notificationId', authorize(['admin', 'teacher']), fileController.updateFileByNotificationId);

router.post('/avatar', authorize(['admin', 'teacher', 'student']), fileController.uploadAvatarFile);

export default router;