import React, { useEffect, useState } from 'react';
import api from '../services/api';
const SelectAsync = ({ value, onChange, placeholder = 'Select...', endpoint = '/suppliers', labelKey = 'name', valueKey = '_id' }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    let mounted = true;
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoint);
        if (!mounted) return;
        setOptions(res.data || []);
      } catch (err) {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
    return () => { mounted = false; };
  }, [endpoint]);
  const filtered = options.filter(o => !filter || (o[labelKey] || '').toString().toLowerCase().includes(filter.toLowerCase()) || (o[valueKey]||'').toString().toLowerCase().includes(filter.toLowerCase()));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input placeholder={placeholder} value={filter} onChange={(e) => setFilter(e.target.value)} />
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- none --</option>
        {loading && <option disabled>Loading...</option>}
        {filtered.map(opt => (
          <option key={opt[valueKey]} value={opt[valueKey]}>{opt[labelKey]}{opt[valueKey] ? ` — ${opt[valueKey]}` : ''}</option>
        ))}
      </select>
    </div>
  );
};
export default SelectAsync;
