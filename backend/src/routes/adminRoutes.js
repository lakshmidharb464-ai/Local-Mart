import { Router } from 'express';
import {
  getPlatformMetrics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  moderateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  overrideDispatch,
  getAdminFarmers,
  createAdminFarmer,
  updateAdminFarmer,
  verifyFarmer,
  deleteFarmer,
  getAdminCustomers,
  createAdminCustomer,
  updateAdminCustomer,
  setCustomerStatus,
  deleteCustomer,
  getAdminDeliveryFleet,
  createAdminDeliveryPartner,
  updateAdminDeliveryPartner,
  setDeliveryStatus,
  deleteDeliveryPartner,
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

// Products Catalog & Moderation
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.patch('/products/:id/moderate', moderateProduct);
router.delete('/products/:id', deleteProduct);

// Orders & Dispatch
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/dispatch', overrideDispatch);

// Farmers Management
router.get('/farmers', getAdminFarmers);
router.post('/farmers', createAdminFarmer);
router.put('/farmers/:id', updateAdminFarmer);
router.patch('/farmers/:id/verify', verifyFarmer);
router.delete('/farmers/:id', deleteFarmer);

// Customers Management
router.get('/customers', getAdminCustomers);
router.post('/customers', createAdminCustomer);
router.put('/customers/:id', updateAdminCustomer);
router.patch('/customers/:id/status', setCustomerStatus);
router.delete('/customers/:id', deleteCustomer);

// Delivery Fleet Management
router.get('/delivery-partners', getAdminDeliveryFleet);
router.post('/delivery-partners', createAdminDeliveryPartner);
router.put('/delivery-partners/:id', updateAdminDeliveryPartner);
router.patch('/delivery-partners/:id/status', setDeliveryStatus);
router.delete('/delivery-partners/:id', deleteDeliveryPartner);

// Settings & KYC & Audit
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.get('/kyc-queue', getKycQueue);
router.patch('/kyc-queue/:id/decision', decideKyc);
router.get('/audit-logs', getAuditLogs);

export default router;
