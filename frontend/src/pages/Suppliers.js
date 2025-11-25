import React, { useEffect, useState } from 'react';
import AdminControls from '../components/AdminControls';
import api from '../services/api';
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '', address: '', tin: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data || []);
    } catch (err) {
      setMessage('Failed to fetch suppliers');
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, form);
        setMessage('Supplier updated');
      } else {
        await api.post('/suppliers', form);
        setMessage('Supplier added');
      }
      setForm({ name: '', contact: '', address: '', tin: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error saving supplier');
    }
  };
  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name || '',
      contact: supplier.contact || '',
      address: supplier.address || '',
      tin: supplier.tin || ''
    });
    setEditingId(supplier._id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setMessage('Supplier deleted');
      fetchSuppliers();
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Error deleting supplier');
    }
  };
  return (
    <div>
      <h2>Suppliers</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="tin" placeholder="TIN" value={form.tin} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Supplier</button>
      </form>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>TIN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{s.supplierId || s._id}</td>
              <td>{s.name}</td>
              <td>{s.contact}</td>
              <td>{s.address}</td>
              <td>{s.tin || ''}</td>
              <td>
                <AdminControls onEdit={() => handleEdit(s)} onDelete={() => handleDelete(s._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Suppliers;
