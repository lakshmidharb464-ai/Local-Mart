import { Router } from 'express';
import {
  getDeliveryOverview,
  toggleDuty,
  getDeliveryOrders,
  acceptTask,
  sendLocationBeacon,
  updateOrderStatus,
  getHubs,
  getShifts,
  bookShift,
  getEarnings,
  getDeliveryProfile,
  updateDeliveryProfile,
  submitDeliveryKyc,
  getDeliveryKyc,
} from '../controllers/deliveryController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Guard all delivery partner routes
router.use(verifyToken, requireRole('Delivery'));

router.get('/overview', getDeliveryOverview);
router.patch('/duty', toggleDuty);
router.get('/orders', getDeliveryOrders);
router.post('/orders/:id/accept', acceptTask);
router.post('/location', sendLocationBeacon);
router.patch('/orders/:id/status', updateOrderStatus);

// Shifts & Hubs
router.get('/hubs', getHubs);
router.get('/shifts', getShifts);
router.post('/shifts', bookShift);

// Earnings & Profile & KYC
router.get('/earnings', getEarnings);
router.get('/profile', getDeliveryProfile);
router.put('/profile', updateDeliveryProfile);
router.get('/kyc', getDeliveryKyc);
router.post('/kyc', submitDeliveryKyc);

export default router;
