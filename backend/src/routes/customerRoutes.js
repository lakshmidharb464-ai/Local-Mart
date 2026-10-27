import { Router } from 'express';
import {
  getLoyaltyTier,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
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
router.put('/customers/addresses/:id', verifyToken, updateAddress);
router.delete('/customers/addresses/:id', verifyToken, deleteAddress);
router.patch('/customers/addresses/:id/default', verifyToken, setDefaultAddress);

// Subscriptions
router.get('/subscriptions', verifyToken, getSubscriptions);
router.post('/subscriptions', verifyToken, createSubscription);
router.patch('/subscriptions/:id', verifyToken, updateSubscription);
router.delete('/subscriptions/:id', verifyToken, deleteSubscription);

export default router;
