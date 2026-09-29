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
  broadcastHarvestAlert,
  getBatches,
  logBatchSpoilage,
  requestPayout,
  getFarmerProfile,
  updateFarmerProfile,
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

// Harvest Planner
router.get('/harvest-plans', getHarvestPlans);
router.post('/harvest-plans', createHarvestPlan);
router.post('/harvest-plans/:id/broadcast', broadcastHarvestAlert);

// Inventory & Batches
router.get('/inventory/batches', getBatches);
router.post('/inventory/batches', logBatchSpoilage);

// Payouts & Profile
router.post('/payouts', requestPayout);
router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmerProfile);

export default router;
