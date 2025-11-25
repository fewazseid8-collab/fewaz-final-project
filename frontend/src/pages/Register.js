import React, { useState } from 'react';
import api from '../services/api';
const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', form);
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};
export default Register;
