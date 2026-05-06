import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MdAdd } from 'react-icons/md';

const Purchases = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const [purchases, setPurchases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        const data = await res.json();
        const orderList = Array.isArray(data) ? data : (data.orders || []);
        // Filter to show only pending orders to simulate incoming items
        setPurchases(orderList.filter(o => !o.isDelivered));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="page-container" ref={containerRef}>
      <div className="page-header">
        <div>
          <h1>Purchase Orders</h1>
          <p>Manage incoming stock and supplier orders.</p>
        </div>
        <button className="btn-primary">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdAdd /> New Order
          </span>
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '30px', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Recent Purchase Orders</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading pending orders...</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No pending orders found.</td></tr>
              ) : purchases.map((order, index) => {
                const status = order.isPaid ? 'Processing' : 'Pending';
                return (
                <tr key={order._id || index}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>#{order._id?.substring(0, 8)}</td>
                  <td style={{ fontWeight: 500 }}>{order.user?.firstName || order.user?.name || 'Guest'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">Details</button>
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

export default Purchases;
