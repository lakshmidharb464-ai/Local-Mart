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

// Earnings & Profile
router.get('/earnings', getEarnings);
router.get('/profile', getDeliveryProfile);
router.put('/profile', updateDeliveryProfile);

export default router;
