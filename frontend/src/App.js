import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import RequireAdmin from './components/RequireAdmin';
function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/*" element={<LoginLinkWrapper />} />
          <Route path="/login" element={<LoginLinkWrapper />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className="app-content page">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<RequireAdmin><Products /></RequireAdmin>} />
              <Route path="/suppliers" element={<RequireAdmin><Suppliers /></RequireAdmin>} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/reports" element={<RequireAdmin><Reports /></RequireAdmin>} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}
function LoginLinkWrapper() {
  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Login />
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
export default App;
