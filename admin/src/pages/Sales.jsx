import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MdDownload } from 'react-icons/md';

const Sales = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          credentials: 'include'
        });
        const data = await res.json();
        const orderList = Array.isArray(data) ? data : (data.orders || []);
        setOrders(orderList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="page-container" ref={containerRef}>
      <div className="page-header">
        <div>
          <h1>Sales Management</h1>
          <p>Track and analyze your sales performance.</p>
        </div>
        <button className="btn-primary">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdDownload /> Export Data
          </span>
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '30px', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Recent Transactions</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found. (Make sure you are logged in as Admin)</td></tr>
              ) : orders.map((order, index) => {
                const status = order.isDelivered ? 'Completed' : order.isPaid ? 'Processing' : 'Pending';
                return (
                <tr key={order._id || index}>
                  <td style={{ fontWeight: 600 }}>#{order._id?.substring(0, 8)}</td>
                  <td>{order.user?.firstName || order.user?.name || 'Guest'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
