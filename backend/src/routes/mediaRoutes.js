import { Router } from 'express';
import { uploadMedia, uploadMiddleware } from '../controllers/mediaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Allow authenticated users to upload files (supports 'files' array or single 'file')
router.post('/upload', verifyToken, uploadMiddleware.array('files', 5), uploadMedia);

export default router;
