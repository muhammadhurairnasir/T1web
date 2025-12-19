const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');

// Get all orders (with optional filters: status, email, pagination)
// GET /api/admin/orders?status=Processing&email=customer@example.com&page=1&limit=10
router.get('/orders', adminOrderController.getAllOrders);

// Get single order by ID
// GET /api/admin/orders/:id
router.get('/orders/:id', adminOrderController.getOrderById);

// Update order status (with state machine validation)
// PUT /api/admin/orders/:id/status
// Body: { status: 'Processing' | 'Delivered' }
router.put('/orders/:id/status', adminOrderController.updateOrderStatus);

// Get available statuses for dropdown/UI
// GET /api/admin/statuses
router.get('/statuses', adminOrderController.getAvailableStatuses);

// Get order statistics (summary for dashboard)
// GET /api/admin/stats/orders
router.get('/stats/orders', adminOrderController.getOrderStats);

module.exports = router;
