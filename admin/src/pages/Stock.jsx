import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Stock = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // The API might return { products: [...] } or an array directly
        const productList = data.products || data || [];
        setProducts(productList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStockStatus = (countInStock) => {
    if (countInStock > 20) return 'In Stock';
    if (countInStock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  return (
    <div className="page-container" ref={containerRef}>
      <div className="page-header">
        <div>
          <h1>Stock Inventory</h1>
          <p>Manage your product inventory levels.</p>
        </div>
        <button className="btn-primary">Add Product</button>
      </div>

      <div className="glass-panel" style={{ marginTop: '30px', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Current Inventory</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Stock Level</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No products found.</td></tr>
              ) : products.map((item, index) => {
                const stockCount = item.countInStock || 0;
                const status = getStockStatus(stockCount);
                return (
                <tr key={item._id || index}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item._id?.substring(0, 8)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${Math.min(100, (stockCount / 100) * 100)}%`,
                            background: stockCount > 20 ? 'var(--success)' : stockCount > 0 ? 'var(--warning)' : 'var(--danger)'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '13px', width: '30px' }}>{stockCount}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${item.price}</td>
                  <td>
                    <span className={`status-badge ${status.toLowerCase().replace(/ /g, '-')}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">Edit</button>
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

export default Stock;
