import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gid,setGid] = useState('');
  const navigate = useNavigate();
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
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Redirect to tasks page
      navigate('/tasks');
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  const handleGoogle = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/googlelogin`, {
        email,
        g_id:gid,
      });
      const token = response.data.token;
      // Store token in localStorage
      localStorage.setItem('token', token);
      // Redirect to tasks page
      navigate('/tasks');
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              className="loginWith"
            >
              <GoogleLogin
                buttonText="Continue with Google"
                onSuccess={(credentialResponse) => {
                  const details = jwtDecode(credentialResponse.credential);
                  setEmail(details.email);
                  setGid(details.sub);
                  handleGoogle();
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                theme="filled_black"
                shape="pill"
                text="continue_with"
              />
            </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;
