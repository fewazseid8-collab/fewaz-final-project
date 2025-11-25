import React, { useEffect, useState } from 'react';
import api from '../services/api';
import SelectAsync from '../components/SelectAsync';
import AdminControls from '../components/AdminControls';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', batch: '', expiryDate: '', quantity: '', price: '', supplier: '', preparation: '', dosage: '', unitOfMeasure: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setMessage('Failed to fetch products');
    }
  };
  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data || []);
    } catch (err) {
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.batch || !form.expiryDate) {
      setMessage('Please fill required fields');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        setMessage('Product updated');
      } else {
        await api.post('/products', form);
        setMessage('Product added');
      }
      setForm({ name: '', category: '', batch: '', expiryDate: '', quantity: '', price: '', supplier: '', preparation: '', dosage: '', unitOfMeasure: '', location: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error saving product');
    }
  };
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      batch: product.batch,
      preparation: product.preparation || '',
      dosage: product.dosage || '',
      unitOfMeasure: product.unitOfMeasure || '',
      location: product.location || '',
      expiryDate: product.expiryDate ? product.expiryDate.slice(0, 10) : '',
      quantity: product.quantity,
      price: product.price,
      supplier: product.supplier?._id || ''
    });
    setEditingId(product._id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted');
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Error deleting product');
    }
  };
  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Analgesic">Analgesic</option>
          <option value="Antipyretic">Antipyretic</option>
          <option value="Antiseptic">Antiseptic</option>
          <option value="Vaccine">Vaccine</option>
          <option value="Antacid">Antacid</option>
          <option value="Antifungal">Antifungal</option>
          <option value="Antiviral">Antiviral</option>
          <option value="Vitamin">Vitamin</option>
          <option value="Other">Other</option>
        </select>
        <input name="batch" placeholder="Batch" value={form.batch} onChange={handleChange} required />
        <input name="preparation" placeholder="Preparation" value={form.preparation} onChange={handleChange} />
        <input name="dosage" placeholder="Dosage" value={form.dosage} onChange={handleChange} />
        <input name="unitOfMeasure" placeholder="Unit" value={form.unitOfMeasure} onChange={handleChange} />
        <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <div style={{ marginTop: 6 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Supplier</label>
          <SelectAsync value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} endpoint={'/suppliers'} />
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>
      {message && <p>{message}</p>}
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Search products" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
      </div>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Batch</th>
            <th>Preparation</th>
            <th>Dosage</th>
            <th>Unit</th>
            <th>Expiry Date</th>
                <th>Original Quantity</th>
                <th>Current Quantity</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter(p => !query || (p.name || '').toLowerCase().includes(query.toLowerCase()) || (p.category||'').toLowerCase().includes(query.toLowerCase()) || (p.batch||'').toLowerCase().includes(query.toLowerCase()))
            .slice((page-1)*perPage, (page-1)*perPage + perPage)
            .map((p) => (
              <tr key={p._id} style={{ background: new Date(p.expiryDate) < new Date() ? '#ffe0e0' : '' }}>
                <td>{p.productId || ''}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.batch}</td>
                <td>{p.preparation || ''}</td>
                <td>{p.dosage || ''}</td>
                <td>{p.unitOfMeasure || ''}</td>
                <td>{p.expiryDate ? p.expiryDate.slice(0, 10) : ''}</td>
                {(() => {
                  const soldUnits = sales.reduce((acc, s) => {
                    try {
                      const prodId = s.product?._id || s.product;
                      if (!prodId) return acc;
                      if (String(prodId) === String(p._id)) {
                        return acc + (Number(s.quantity) || 0);
                      }
                    } catch (e) {
                    }
                    return acc;
                  }, 0);
                  const original = (typeof p.initialQuantity !== 'undefined' && p.initialQuantity !== null)
                    ? Number(p.initialQuantity)
                    : (Number(p.quantity || 0) + soldUnits);
                  const current = Math.max(0, original - soldUnits);
                  return (
                    <>
                      <td style={{ color: original < 10 ? 'red' : 'inherit' }}>{original}</td>
                      <td style={{ color: current < 10 ? 'red' : 'inherit' }}>{current}</td>
                    </>
                  );
                })()}
                <td>{p.price}</td>
                <td>{p.supplier?.name || p.supplier || ''}</td>
                <td>
                <AdminControls product={p} onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setPage(Math.max(1, page-1))} disabled={page===1}>Prev</button>
        <div>Page {page}</div>
        <button onClick={() => setPage(page+1)} disabled={products.filter(p => !query || (p.name || '').toLowerCase().includes(query.toLowerCase())).length <= page*perPage}>Next</button>
      </div>
    </div>
  );
};
export default Products;
