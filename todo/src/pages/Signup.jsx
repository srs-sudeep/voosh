import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gid,setGid] = useState('');
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
      // Store token in localStorage
      console.log(response.data.token)

      localStorage.setItem('token', token);
      // Redirect to tasks page
      navigate('/tasks');
    } catch (error) {
      console.error('Error during registration', error);
    }
  };
  const handleGoogle = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/googlesignup`, {
        email,
        name,
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
      <h2>Signup Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Signup</button>
      </form>
      <div>
      <GoogleOAuthProvider
                className="loginWith"
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const details = jwtDecode(credentialResponse.credential);
                    console.log(details.email);
                    setEmail(details.email);
                    setGid(details.sub);
                    setName(details.name);
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

export default Signup;
