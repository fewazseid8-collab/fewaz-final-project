import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const decodeJwt = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      return null;
    }
  }
};
const AdminControls = ({ onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  if (user && user.role === 'admin') {
    const handleEditClick = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      try { console.debug('AdminControls: edit clicked'); } catch(e){}
      if (typeof onEdit === 'function') onEdit();
    };
    const handleDeleteClick = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      try { console.debug('AdminControls: delete clicked'); } catch(e){}
      if (typeof onDelete === 'function') onDelete();
    };
    return (
      <>
        <button type="button" onClick={handleEditClick}>Edit</button>
        <button type="button" onClick={handleDeleteClick}>Delete</button>
      </>
    );
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    const payload = decodeJwt(token);
    if (payload && payload.role === 'admin') {
      const handleEditClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try { console.debug('AdminControls: edit clicked (token)'); } catch(e){}
        if (typeof onEdit === 'function') onEdit();
      };
      const handleDeleteClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try { console.debug('AdminControls: delete clicked (token)'); } catch(e){}
        if (typeof onDelete === 'function') onDelete();
      };
      return (
        <>
          <button type="button" onClick={handleEditClick}>Edit</button>
          <button type="button" onClick={handleDeleteClick}>Delete</button>
        </>
      );
    }
  }
  return null;
};
export default AdminControls;
