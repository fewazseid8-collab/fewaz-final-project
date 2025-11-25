import React, { useEffect, useState } from 'react';
import api from '../services/api';
const Reports = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data);
        const salesRes = await api.get('/sales');
        setSales(salesRes.data);
      } catch (err) {
        setMessage('Failed to fetch reports');
      }
    };
    fetchData();
  }, []);
  const soldMap = sales.reduce((m, s) => {
    const prodId = s.product?._id || s.product;
    if (!prodId) return m;
    m[prodId] = (m[prodId] || 0) + (Number(s.quantity) || 0);
    return m;
  }, {});
  const expiredProducts = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date());
  const lowStockProducts = products.filter(p => {
    const sold = soldMap[p._id] || 0;
    const original = (typeof p.initialQuantity !== 'undefined' && p.initialQuantity !== null)
      ? Number(p.initialQuantity)
      : (Number(p.quantity || 0) + sold);
    const current = Math.max(0, original - sold);
    return current < 10;
  });
  return (
    <div>
      <h2>Reports</h2>
      {message && <p>{message}</p>}
      <h3>Inventory Report</h3>
      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Original Qty</th>
            <th>Current Qty</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const sold = soldMap[p._id] || 0;
            const original = (typeof p.initialQuantity !== 'undefined' && p.initialQuantity !== null)
              ? Number(p.initialQuantity)
              : (Number(p.quantity || 0) + sold);
            const current = Math.max(0, original - sold);
            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{original}</td>
                <td style={{ color: current < 10 ? 'red' : 'inherit' }}>{current}</td>
                <td>{p.expiryDate ? p.expiryDate.slice(0, 10) : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Sales Report</h3>
      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s._id}>
              <td>{s.product?.name || s.product || ''}</td>
              <td>{s.quantity}</td>
              <td>{s.date ? s.date.slice(0, 10) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Expiry Alerts</h3>
      <ul>
        {expiredProducts.map(p => (
          <li key={p._id}>{p.name} (expired {p.expiryDate ? p.expiryDate.slice(0, 10) : ''})</li>
        ))}
      </ul>
      <h3>Low Stock Alerts</h3>
      <ul>
        {lowStockProducts.map(p => (
          <li key={p._id}>{p.name} (quantity: {p.quantity})</li>
        ))}
      </ul>
    </div>
  );
};
export default Reports;
