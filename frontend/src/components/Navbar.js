import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <img
          src="/images.png"
          alt="logo"
          className="nav-logo"
          style={{ height: '2em', backgroundColor: 'transparent', objectFit: 'contain' }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pharma Inventory
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        {user?.role === 'admin' && <Button color="inherit" component={Link} to="/products">Products</Button>}
        {user?.role === 'admin' && <Button color="inherit" component={Link} to="/suppliers">Suppliers</Button>}
          <Button color="inherit" component={Link} to="/sales">Sale/Dispense</Button>
        {user?.role === 'admin' && <Button color="inherit" component={Link} to="/reports">Reports</Button>}
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
