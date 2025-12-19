/**
 * OrderStats.jsx
 * Dashboard component showing order statistics and summary.
 *
 * Features:
 * - Shows order count by status (Placed, Processing, Delivered)
 * - Displays total revenue
 * - Summary cards for quick overview
 */

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import './OrderStats.css';

const OrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  /**
   * Fetch order statistics from backend
   */
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/stats/orders');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) {
    return <div className="alert alert-info">No statistics available</div>;
  }

  return (
    <div className="order-stats-container">
      <h2>Order Statistics</h2>

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <h4>Total Orders</h4>
          <p className="stat-value">{stats.total.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p className="stat-value">${stats.total.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="status-breakdown">
        <h3>Orders by Status</h3>
        <div className="status-cards">
          {stats.byStatus.map(status => (
            <div key={status._id} className={`status-card status-${status._id.toLowerCase()}`}>
              <h5>{status._id}</h5>
              <div className="status-details">
                <p><strong>Count:</strong> {status.count}</p>
                <p><strong>Revenue:</strong> ${status.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button className="btn btn-secondary" onClick={fetchStats}>
        Refresh Stats
      </button>
    </div>
  );
};

export default OrderStats;
