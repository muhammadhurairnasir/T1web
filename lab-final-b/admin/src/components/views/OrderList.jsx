/**
 * OrderList.jsx
 * Admin component to display all orders with filters and status update capability.
 *
 * Features:
 * - List all orders (paginated)
 * - Filter by status and customer email
 * - Update order status with state machine validation
 * - Shows order details (ID, Date, Items, Total, Discount, Status)
 */

import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../services/axiosInstance';
import OrderStatusModal from './OrderStatusModal';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [statuses, setStatuses] = useState([]);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // (effects are declared below after the helper functions so lint won't
  // complain about using functions before they're defined)

  /**
   * Fetch available statuses for dropdown
   */
  const fetchStatuses = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/statuses');
      if (response.data.success) {
        setStatuses(response.data.data.statuses);
      }
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  /**
   * Fetch orders with filters
   */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(filterStatus && { status: filterStatus }),
        ...(filterEmail && { email: filterEmail })
      });

      const response = await axiosInstance.get(`/api/admin/orders?${params}`);
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterStatus, filterEmail]);

  // Fetch available statuses on component mount
  useEffect(() => {
    fetchStatuses();
  }, []);

  // Fetch orders when filters or page changes (fetchOrders is stable via useCallback)
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Handle status update modal open
   */
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  /**
   * Handle status update success
   */
  const handleStatusUpdated = (updatedOrder) => {
    setOrders(orders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    setShowModal(false);
    setSelectedOrder(null);
  };

  /**
   * Handle filter reset
   */
  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterEmail('');
    setPage(1);
  };

  return (
    <div className="order-list-container">
      <h2>Order Management</h2>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="email-filter">Customer Email:</label>
          <input
            id="email-filter"
            type="email"
            placeholder="Filter by email..."
            value={filterEmail}
            onChange={(e) => {
              setFilterEmail(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button className="btn btn-secondary" onClick={handleResetFilters}>
          Reset Filters
        </button>
      </div>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">No orders found.</div>
      ) : (
        <>
          {/* Orders table */}
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>
                    <small>{order._id}</small>
                  </td>
                  <td>
                    <small>{new Date(order.createdAt).toLocaleString()}</small>
                  </td>
                  <td>
                    <small>{order.customerEmail || '—'}</small>
                  </td>
                  <td>
                    <small>
                      {order.items.map(item => `${item.name} x${item.qty}`).join(', ')}
                    </small>
                  </td>
                  <td>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </td>
                  <td>
                    {order.discount && order.discount.code ? (
                      <small className="discount-badge">
                        {order.discount.code} -{order.discount.amount.toFixed(2)}
                      </small>
                    ) : (
                      <small>—</small>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleOpenModal(order)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-section">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Status Update Modal */}
      {showModal && selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          statuses={statuses}
          onClose={() => setShowModal(false)}
          onUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default OrderList;
