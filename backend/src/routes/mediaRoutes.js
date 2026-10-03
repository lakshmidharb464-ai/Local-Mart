import { Router } from 'express';
import { uploadMedia, uploadMiddleware } from '../controllers/mediaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Allow authenticated users to upload files (supports 'files', 'file', 'image', etc.)
router.post('/upload', verifyToken, uploadMiddleware.any(), uploadMedia);

export default router;
