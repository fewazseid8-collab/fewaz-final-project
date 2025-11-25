import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ productId: '', productLabel: '', preparation: '', quantity: '', patientName: '', frequency: '', duration: '', singleDose: '' });
  const [editId, setEditId] = useState('');
  const wrapperRef = useRef();
  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data);
    } catch (err) {
      setMessage('Failed to fetch sales');
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
    }
  };
  useEffect(() => {
    fetchSales();
    fetchProducts();
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matched = products.filter(p => (p.name||'').toLowerCase().includes(q) || (p.dosage||'').toLowerCase().includes(q));
    setSuggestions(matched.slice(0, 10));
    setShowSuggestions(true);
  }, [query, products]);
  const handleSelectProduct = (p) => {
    const label = `${p.name}${p.dosage ? ' — ' + p.dosage : ''}`;
    setForm({ ...form, productId: p._id, productLabel: label, preparation: p.preparation || '' });
    setQuery(label);
    setShowSuggestions(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productLabel') {
      setQuery(value);
      setForm({ ...form, productLabel: value, productId: '', preparation: '' });
    } else setForm({ ...form, [name]: value });
  };
  const parseLeadingNumber = (text) => {
    if (!text && text !== 0) return NaN;
    const m = String(text).match(/(\d+)/);
    return m ? parseInt(m[1], 10) : NaN;
  };
  const frequencyToNumber = (freq) => {
    if (!freq) return NaN;
    const f = freq.toLowerCase();
    if (f.includes('once')) return 1;
    if (f.includes('twice')) return 2;
    if (f.includes('three')) return 3;
    if (f.includes('every 6')) return 4;
    if (f.includes('every 8')) return 3;
    if (f.includes('as needed')) return 1;
    const n = parseLeadingNumber(f);
    return isNaN(n) ? NaN : n;
  };
  useEffect(() => {
    const freqNum = frequencyToNumber(form.frequency);
    const durationNum = parseLeadingNumber(form.duration) || NaN;
    const singleDoseNum = parseLeadingNumber(form.singleDose) || NaN;
    if (isNaN(freqNum) || isNaN(durationNum) || isNaN(singleDoseNum)) return;
    const needed = freqNum * durationNum * singleDoseNum;
    const packSize = parseLeadingNumber(form.preparation) || 1;
    const packsNeeded = Math.ceil(needed / packSize);
    if (String(form.quantity) !== String(needed)) {
      setForm(prev => ({ ...prev, quantity: needed, _packsNeeded: packsNeeded }));
    } else {
      setForm(prev => ({ ...prev, _packsNeeded: packsNeeded }));
    }
  }, [form.frequency, form.duration, form.singleDose, form.preparation]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) {
      setMessage('Please select a product from suggestions');
      return;
    }
    try {
      const payload = {
        product: form.productId,
        quantity: Number(form.quantity) || 0,
        patientName: form.patientName,
        preparation: form.preparation,
        frequency: form.frequency,
        duration: form.duration,
        singleDose: form.singleDose
      };
      if (editId) {
        await api.put(`/sales/${editId}`, payload);
        setMessage('Sale updated');
      } else {
        await api.post('/sales', payload);
        setMessage('Sale recorded');
      }
      setForm({ productId: '', productLabel: '', preparation: '', quantity: '', patientName: '', frequency: '', duration: '', singleDose: '' });
      setEditId('');
      setQuery('');
      fetchSales();
    } catch (err) {
      setMessage('Error recording sale');
    }
  };
  const handleEdit = (s) => {
    const label = s.product?.name ? `${s.product.name}${s.product.dosage ? ' — ' + s.product.dosage : ''}` : '';
    const prepText = s.preparation || s.product?.preparation || '';
    const packSize = parseLeadingNumber(prepText) || 1;
    const packs = packSize > 0 ? Math.ceil((s.quantity || 0) / packSize) : s.quantity || '';
    setForm({
      productId: s.product?._id || s.product || '',
      productLabel: label,
      preparation: prepText,
      quantity: s.quantity || '',
      _packsNeeded: packs,
      patientName: s.patientName || (s.user?.username || ''),
      frequency: s.frequency || '',
      duration: s.duration || '',
      singleDose: s.singleDose || ''
    });
    setQuery(label);
    setEditId(s._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancelEdit = () => {
    setEditId('');
    setForm({ productId: '', productLabel: '', preparation: '', quantity: '', patientName: '', frequency: '', duration: '', singleDose: '' });
    setQuery('');
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale? This will restore product quantity.')) return;
    try {
      await api.delete(`/sales/${id}`);
      setMessage('Sale deleted');
      if (editId === id) handleCancelEdit();
      fetchSales();
    } catch (err) {
      setMessage('Error deleting sale');
    }
  };
  return (
    <div>
      <h2>Sale/Dispense</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }} ref={wrapperRef}>
        <div style={{ position: 'relative' }}>
          <input name="productLabel" placeholder="Product name" value={form.productLabel || query} onChange={handleChange} required autoComplete="off" />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{ position: 'absolute', zIndex: 20, background: '#fff', border: '1px solid #ddd', listStyle: 'none', margin: 0, padding: 4, maxHeight: 200, overflowY: 'auto', width: '100%' }}>
              {suggestions.map(p => (
                <li key={p._id} style={{ padding: 6, cursor: 'pointer' }} onClick={() => handleSelectProduct(p)}>{p.name}{p.dosage ? ' — ' + p.dosage : ''}</li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input name="quantity" type="number" placeholder="Quantity (units)" value={form.quantity} onChange={handleChange} required />
          <div style={{ fontSize: 12, color: '#666' }}>{form._packsNeeded ? `${form._packsNeeded} pack(s)` : ''}</div>
        </div>
        <input name="preparation" placeholder="Preparation (auto-filled)" value={form.preparation} onChange={handleChange} />
        <select name="frequency" value={form.frequency} onChange={handleChange}>
          <option value="">Select frequency</option>
          <option value="once a day">Once a day</option>
          <option value="twice a day">Twice a day</option>
          <option value="three times a day">Three times a day</option>
          <option value="every 6 hours">Every 6 hours</option>
          <option value="every 8 hours">Every 8 hours</option>
          <option value="as needed">As needed</option>
        </select>
        <input name="duration" type="text" placeholder="Duration (e.g. 5 days)" value={form.duration} onChange={handleChange} />
        <input name="patientName" placeholder="Patient name" value={form.patientName} onChange={handleChange} />
        <button type="submit">{editId ? 'Save Changes' : 'Record Sale'}</button>
        {editId && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Preparation</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Single Dose</th>
            <th>Quantity (units)</th>
            <th>Packs</th>
            <th>Date</th>
            <th>Patient</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{s.product?.name ? `${s.product.name}${s.product.dosage ? ' — ' + s.product.dosage : ''}` : (s.product || '')}</td>
              <td>{s.preparation || ''}</td>
              <td>{s.frequency || ''}</td>
              <td>{s.duration || ''}</td>
              <td>{s.singleDose || ''}</td>
              <td>{Number(s.quantity) || 0}</td>
              <td>{(() => {
                const prepText = s.preparation || s.product?.preparation || '';
                const packSize = parseLeadingNumber(prepText) || 1;
                const units = Number(s.quantity) || 0;
                const packs = packSize > 0 ? Math.ceil(units / packSize) : units;
                return packs;
              })()}</td>
              <td>{s.date ? s.date.slice(0, 10) : ''}</td>
              <td>{s.patientName || (s.user?.username || s.user || '')}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => handleEdit(s)} style={{ marginRight: 6 }}>Edit</button>
                <button type="button" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Sales;
