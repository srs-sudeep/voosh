import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Link as MuiLink } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gid, setGid] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');  // Token existence check
  };

  useEffect(() => {
    if (isAuthenticated() === true) {
      navigate("/tasks");
    }
  }, [navigate]);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };
    loadGoogleScript();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      if (token) {
        login();
        navigate('/tasks');
      }
    } catch (error) {
      toast.error('Error during login. Please check your credentials.');
      console.error('Error during login', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogle = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/googlelogin`, {
        email,
        g_id: gid,
      });
      const token = response.data.token;
      // Store token in localStorage
      localStorage.setItem('token', token);
      if (token) {
        login();
        navigate('/tasks');
      }
    } catch (error) {
      toast.error('Error during Google login.');
      console.error('Error during login', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'white'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: '#007BFF', color: 'white' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" color="textSecondary" align="center">
          Don't have an account?{' '}
          <MuiLink component={Link} to="/signup">
            Signup
          </MuiLink>
        </Typography>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            buttonText="Login with Google"
            onSuccess={(credentialResponse) => {
              const details = jwtDecode(credentialResponse.credential);
              setEmail(details.email);
              setGid(details.sub);
              handleGoogle();
            }}
            onError={() => {
              toast.error('Google login failed. Please try again.');
              console.log('Login Failed');
            }}
            theme="filled_black"
            text="continue_with"
            shape="pill"
          />
        </GoogleOAuthProvider>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Login;
