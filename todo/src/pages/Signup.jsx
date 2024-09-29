import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Box, Button, Container, TextField, Typography, Grid, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [gid, setGid] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 digit

  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password'); // Watch the password field for confirmation check

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: data.firstName + data.lastName,
        email: data.email,
        password: data.password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      if (token) {
        login();
        navigate('/tasks');
        toast.success('Signup successful!');
      }
    } catch (error) {
      console.error('Error during registration', error);
      toast.error(error.response.data.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/googlesignup`, {
        email: email,
        name:name,
        g_id: gid,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      if (token) {
        login();
        navigate('/tasks');
        toast.success('Google signup successful!');
      }
    } catch (error) {
      console.error('Error during Google signup', error);
      toast.error('Google signup failed! Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
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
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          SIGNUP
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('firstName', { required: 'First name is required' })}
            error={!!errors.firstName}
            helperText={errors.firstName ? errors.firstName.message : ''}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('lastName', { required: 'Last name is required' })}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : ''}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address'
              }
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: passwordRegex,
                message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.'
              }
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: value => value === password || 'Passwords do not match'
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
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
                setGid(details.sub);
                setEmail(details.email);
                setName(details.name)
                handleGoogle();
              }}
              onError={() => toast.error('Login Failed')}
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

        {/* Toast Container for notifications */}
        <ToastContainer />
      </Box>
    </Container>
  );
};

export default Signup;
