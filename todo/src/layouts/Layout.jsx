import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in based on the presence of a token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if a token exists
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    // Remove token and update the login state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {!isLoggedIn ? (
          <>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Signup" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      {/* AppBar for the Navbar */}
      <AppBar position="static">
        <Toolbar>
          {/* Menu Icon for mobile view */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}  // Visible only in mobile view
          >
            <MenuIcon />
          </IconButton>

          {/* Title or Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>

          {/* Links for desktop view */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>  {/* Hidden in mobile view */}
            {!isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
              </>
            ) : (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>

      {/* Outlet to render child routes */}
      <Outlet />
    </div>
  );
};

export default Layout;
