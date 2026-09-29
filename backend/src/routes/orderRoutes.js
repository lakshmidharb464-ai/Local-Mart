import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  trackOrder,
  validateCoupon,
} from '../controllers/orderController.js';
import { verifyToken, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Order creation & customer history
router.get('/orders', optionalAuth, getOrders);
router.post('/orders', verifyToken, createOrder);
router.get('/orders/my-orders', verifyToken, getMyOrders);
router.patch('/orders/:id/status', verifyToken, updateOrderStatus);  // ← secured: was optionalAuth
router.get('/orders/:id/track', optionalAuth, trackOrder);

// Coupon validation
router.post('/coupons/validate', optionalAuth, validateCoupon);

export default router;

