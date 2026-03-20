import express from 'express';
import roleController from '../controllers/roleController.js';

const router = express.Router();

router.get('/', roleController.getRoles); // Get all roles

export default router;