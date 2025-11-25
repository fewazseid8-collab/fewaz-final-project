import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <div style={{ padding: 20 }}><h3>Unauthorized</h3><p>You need admin privileges to view this page.</p></div>;
  return children;
};
export default RequireAdmin;
