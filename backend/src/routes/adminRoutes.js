import { Router } from 'express';
import {
  getPlatformMetrics,
  getAdminProducts,
  moderateProduct,
  getAdminOrders,
  overrideDispatch,
  getAdminFarmers,
  verifyFarmer,
  getAdminCustomers,
  setCustomerStatus,
  getAdminDeliveryFleet,
  getAdminReports,
  getAdminSettings,
  updateAdminSettings,
  getKycQueue,
  decideKyc,
  getAuditLogs,
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Guard all admin routes
router.use(verifyToken, requireRole('Admin'));

// Platform Metrics & Reports
router.get('/metrics', getPlatformMetrics);
router.get('/reports', getAdminReports);

// Products Moderation
router.get('/products', getAdminProducts);
router.patch('/products/:id/moderate', moderateProduct);

// Orders & Dispatch
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/dispatch', overrideDispatch);

// Farmers
router.get('/farmers', getAdminFarmers);
router.patch('/farmers/:id/verify', verifyFarmer);

// Customers
router.get('/customers', getAdminCustomers);
router.patch('/customers/:id/status', setCustomerStatus);

// Delivery Fleet
router.get('/delivery-partners', getAdminDeliveryFleet);

// Settings & KYC & Audit
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.get('/kyc-queue', getKycQueue);
router.patch('/kyc-queue/:id/decision', decideKyc);
router.get('/audit-logs', getAuditLogs);

export default router;
