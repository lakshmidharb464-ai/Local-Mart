import { Router } from 'express';
import {
  getCategories,
  getProducts,
  getProductById,
  getFarmProfile,
  addReview,
} from '../controllers/productController.js';
import { verifyToken, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/products', optionalAuth, getProducts);
router.get('/products/:id', optionalAuth, getProductById);
router.get('/farms/:farmerId', getFarmProfile);

// Authenticated reviews
router.post('/products/:id/reviews', verifyToken, addReview);

export default router;
