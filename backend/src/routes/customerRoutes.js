import { Router } from 'express';
import {
  getLoyaltyTier,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../controllers/customerController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Loyalty & Wishlist
router.get('/customers/tier', verifyToken, getLoyaltyTier);
router.get('/customers/wishlist', verifyToken, getWishlist);
router.post('/customers/wishlist', verifyToken, toggleWishlist);

// Addresses
router.get('/customers/addresses', verifyToken, getAddresses);
router.post('/customers/addresses', verifyToken, addAddress);

// Subscriptions
router.get('/subscriptions', verifyToken, getSubscriptions);
router.post('/subscriptions', verifyToken, createSubscription);
router.patch('/subscriptions/:id', verifyToken, updateSubscription);
router.delete('/subscriptions/:id', verifyToken, deleteSubscription);

export default router;
