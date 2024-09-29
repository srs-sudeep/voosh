import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // Use Auth context
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout(); // Call logout from Auth context
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
            <ListItem button component={Link} to="/signup" selected={location.pathname === '/signup'}>
              <ListItemText primary="Signup" />
            </ListItem>
            <ListItem button component={Link} to="/login" selected={location.pathname === '/login'}>
              <ListItemText primary="Login" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogout} sx={{ backgroundColor: 'red', color: 'white' }}>
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
            Voosh Todo
          </Typography>

          {/* Links for desktop view */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>  {/* Hidden in mobile view */}
            {!isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  sx={{
                    ...(location.pathname === '/signup' && {
                      backgroundColor: 'white',
                      color: 'black',
                      borderRadius: 1,
                    }),
                    mr: 2,
                  }}
                >
                  Signup
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    ...(location.pathname === '/login' && {
                      backgroundColor: 'white',
                      color: 'black',
                      borderRadius: 1,
                    }),
                    mr: 2,
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
              >
                Logout
              </Button>
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
