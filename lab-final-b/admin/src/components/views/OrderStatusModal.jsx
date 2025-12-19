/**
 * OrderStatusModal.jsx
 * Modal component to update order status with state machine validation.
 *
 * Features:
 * - Shows current order status
 * - Displays allowed next statuses only (prevents invalid transitions)
 * - Shows validation error messages from server
 * - Handles status update via API
 */

import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import './OrderStatusModal.css';

const OrderStatusModal = ({ order, statuses, onClose, onUpdated }) => {
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate allowed next statuses based on current status.
   * The backend enforces state machine logic; this just shows hints.
   */
  const statusSequence = ['Placed', 'Processing', 'Delivered'];
  const currentIndex = statusSequence.indexOf(order.status);
  const allowedNextStatuses = currentIndex < statusSequence.length - 1
    ? [statusSequence[currentIndex + 1]]
    : [];

  /**
   * Handle status update
   */
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      setError('Please select a new status');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put(
        `/api/admin/orders/${order._id}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        // Notify parent component
        onUpdated(response.data.data);
        alert(`Order status updated to "${newStatus}"`);
      } else {
        setError(response.data.error || 'Failed to update status');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update order status';
      setError(errorMsg);
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Update Order Status</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-info">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Current Status:</strong> <span className="current-status">{order.status}</span></p>
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <form onSubmit={handleUpdateStatus}>
            <div className="form-group">
              <label htmlFor="new-status">Next Status:</label>
              {allowedNextStatuses.length > 0 ? (
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Select Status --</option>
                  {allowedNextStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="alert alert-info">
                  Order is in final state: {order.status}. No further status updates allowed.
                </div>
              )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="status-sequence-hint">
              <small>Status flow: Placed → Processing → Delivered</small>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newStatus || allowedNextStatuses.length === 0}
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
