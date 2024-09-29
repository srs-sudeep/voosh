import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Box, Button, Container, TextField, Typography, Grid, Divider } from '@mui/material';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gid, setGid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/tasks'); // Redirect to tasks page
    } catch (error) {
      console.error('Error during registration', error);
    }
  };

  const handleGoogle = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/googlesignup`, {
        email,
        name,
        g_id: gid,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/tasks'); // Redirect to tasks page
    } catch (error) {
      console.error('Error during Google signup', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Signup
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2, mb: 2, py: 1.5 }}
        >
          Signup
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Grid container justifyContent="center">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const details = jwtDecode(credentialResponse.credential);
              setEmail(details.email);
              setGid(details.sub);
              setName(details.name);
              handleGoogle();
            }}
            onError={() => console.log('Login Failed')}
            theme="filled_black"
            shape="pill"
            text="continue_with"
          />
        </GoogleOAuthProvider>
      </Grid>

      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          Already have an account?{' '}
          <Button variant="text" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
