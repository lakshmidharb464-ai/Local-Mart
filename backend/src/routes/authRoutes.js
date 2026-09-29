import { Router } from 'express';
import { register, login, logout, getMe, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

export default router;

