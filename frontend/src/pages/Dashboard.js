import React, { useEffect, useState } from 'react';
import api from '../services/api';
import SimplePie from '../components/SimplePie';
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data || []);
        const salesRes = await api.get('/sales');
        setSales(salesRes.data || []);
      } catch (err) {
        setMessage('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);
  const expiredProducts = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date());
  const lowStockProducts = products.filter(p => (p.quantity || 0) < 10);
  const totalSales = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const prodByPrep = Object.values(products.reduce((acc, p) => {
    const key = p.preparation || 'Unknown';
    acc[key] = acc[key] || { name: key, value: 0 };
    acc[key].value += 1;
    return acc;
  }, {}));
  const salesByProduct = Object.values(sales.reduce((acc, s) => {
    const name = s.product?.name || 'Unknown';
    acc[name] = acc[name] || { name, value: 0 };
    acc[name].value += (s.quantity || 0);
    return acc;
  }, {}));
  const soldMap = sales.reduce((m, s) => {
    const prodId = s.product?._id || s.product;
    if (!prodId) return m;
    m[prodId] = (m[prodId] || 0) + (Number(s.quantity) || 0);
    return m;
  }, {});
  const stockBuckets = { InStock: 0, Low: 0, Out: 0, Expired: 0 };
  products.forEach(p => {
    const soldUnits = soldMap[p._id] || 0;
    const original = (typeof p.initialQuantity !== 'undefined' && p.initialQuantity !== null)
      ? Number(p.initialQuantity)
      : (Number(p.quantity || 0) + soldUnits);
    const current = Math.max(0, original - soldUnits);
    if (p.expiryDate && new Date(p.expiryDate) < new Date()) stockBuckets.Expired += 1;
    else if (current <= 0) stockBuckets.Out += 1;
    else if (current < 10) stockBuckets.Low += 1;
    else stockBuckets.InStock += 1;
  });
  const stockData = [
    { name: 'In Stock', value: stockBuckets.InStock, color: '#10b981' },
    { name: 'Low', value: stockBuckets.Low, color: '#f59e0b' },
    { name: 'Out', value: stockBuckets.Out, color: '#ef4444' },
    { name: 'Expired', value: stockBuckets.Expired, color: '#6b7280' },
  ];
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 }}>
        <div style={{ flex: 1 }} className="card page">
          <h2>Dashboard</h2>
          {message && <p className="small-muted">{message}</p>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1 }} className="card">
              <h4>Summary</h4>
              <p>Total Products: <strong>{products.length}</strong></p>
              <p>Total Sales (units): <strong>{totalSales}</strong></p>
            </div>
            <div style={{ flex: 1 }} className="card">
              <h4>Alerts</h4>
              <p className="small-muted">Expired: {expiredProducts.length}</p>
              <p className="small-muted">Low stock: {lowStockProducts.length}</p>
            </div>
          </div>
        </div>
        <div style={{ width: 420 }} className="card page">
          <h4>Stock Status</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SimplePie data={stockData} size={200} innerRadius={0.6} />
            <div>
              {stockData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 12, height: 12, background: d.color, borderRadius: 3 }} />
                  <div>{d.name}: <strong>{d.value}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
        <div style={{ flex: 1 }} className="card page">
          <h4>Products by Preparation</h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <SimplePie data={prodByPrep.map((d,i)=>({ ...d, color: undefined }))} size={180} innerRadius={0.6} />
            <div>
              {prodByPrep.map((d, i) => (
                <div key={d.name} className="small-muted">{d.name}: <strong>{d.value}</strong></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} className="card page">
          <h4>Sales Distribution</h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <SimplePie data={salesByProduct.slice(0,8).map((d,i)=>({ ...d, color: undefined }))} size={180} innerRadius={0.64} />
            <div style={{ maxHeight: 220, overflow: 'auto' }}>
              {salesByProduct.slice(0,12).map((d, i) => (
                <div key={d.name} className="small-muted">{d.name}: <strong>{d.value}</strong></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18 }} className="card page">
        <h4>Expiry Alerts</h4>
        <ul>
          {expiredProducts.map(p => (
            <li key={p._id}>{p.name} (expired {p.expiryDate ? p.expiryDate.slice(0, 10) : ''})</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 12 }} className="card page">
        <h4>Low Stock Alerts</h4>
        <ul>
          {lowStockProducts.map(p => (
            <li key={p._id}>{p.name} (quantity: {p.quantity})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
