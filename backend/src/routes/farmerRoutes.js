import { Router } from 'express';
import {
  getFarmerOverview,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerOrders,
  updateFarmerOrderStatus,
  getHarvestPlans,
  createHarvestPlan,
  deleteHarvestPlan,
  broadcastHarvestAlert,
  postBroadcast,
  getBatches,
  logBatchSpoilage,
  requestPayout,
  getFarmerPayouts,
  getFarmerProfile,
  updateFarmerProfile,
  submitFarmerKyc,
  getFarmerKyc,
} from '../controllers/farmerController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// Guard all farmer routes
router.use(verifyToken, requireRole('Farmer'));

router.get('/overview', getFarmerOverview);

// Products
router.get('/products', getMyProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getFarmerOrders);
router.patch('/orders/:id/status', updateFarmerOrderStatus);

// Harvest Planner & Broadcast
router.get('/harvest-plans', getHarvestPlans);
router.post('/harvest-plans', createHarvestPlan);
router.delete('/harvest-plans/:id', deleteHarvestPlan);
router.post('/harvest-plans/:id/broadcast', broadcastHarvestAlert);
router.post('/broadcast', postBroadcast);

// Inventory & Batches
router.get('/inventory/batches', getBatches);
router.post('/inventory/batches', logBatchSpoilage);

// Payouts & Profile & KYC
router.get('/payouts', getFarmerPayouts);
router.post('/payouts', requestPayout);
router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmerProfile);
router.get('/kyc', getFarmerKyc);
router.post('/kyc', submitFarmerKyc);

export default router;
