/**
 * Admin Order Controller
 * Provides API endpoints for admin to manage orders (update status, view all, etc.)
 * These endpoints are JSON-based for React admin dashboard integration.
 */

const Order = require('../models/Order');
const { isValidTransition, getAllStatuses, getNextStatus } = require('../utils/orderStatusValidator');

/**
 * GET /api/admin/orders
 * Retrieve all orders with optional filters
 * Query params: status, email, page, limit
 */
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.email) {
      filter.customerEmail = { $regex: req.query.email, $options: 'i' };
    }

    // Get total count
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Get paginated orders, sorted by newest first
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit
        }
      }
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

/**
 * GET /api/admin/orders/:id
 * Get a single order by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
};

/**
 * PUT /api/admin/orders/:id/status
 * Update order status with validation
 * Body: { status: 'Processing' | 'Delivered' }
 *
 * Validation:
 *   - Current status and new status must both be valid
 *   - Can only move to the next status (no skipping: Placed → Processing → Delivered)
 *   - Cannot move backward
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: 'Status field is required'
      });
    }

    // Fetch the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Validate transition
    const validation = isValidTransition(order.status, newStatus);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
        currentStatus: order.status,
        allowedNextStatus: order.status === 'Delivered' ? null : getNextStatus(order.status)
      });
    }

    // Update status
    order.status = newStatus;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${newStatus}"`,
      data: order
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
};

/**
 * GET /api/admin/orders/statuses/list
 * Get list of all valid statuses (for dropdown/UI in React admin)
 */
exports.getAvailableStatuses = (req, res) => {
  try {
    const statuses = getAllStatuses();
    res.json({
      success: true,
      data: { statuses }
    });
  } catch (err) {
    console.error('Error fetching statuses:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statuses' });
  }
};

/**
 * GET /api/admin/orders/stats/summary
 * Get order statistics (summary for admin dashboard)
 */
exports.getOrderStats = async (req, res) => {
  try {
    // Count orders by status
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total orders and revenue
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        total: totalStats[0] || { totalOrders: 0, totalRevenue: 0 }
      }
    });
  } catch (err) {
    console.error('Error fetching order stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};
