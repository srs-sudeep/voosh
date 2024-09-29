const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes'); // Adjust the path as necessary
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

jest.mock('../controllers/authController', () => ({
  register: jest.fn((req, res) => {
    res.status(201).json({ token: 'mockToken' });
  }),
  login: jest.fn((req, res) => {
    res.status(200).json({ token: 'mockToken' });
  }),
  googleLogin: jest.fn((req, res) => {
    res.status(200).json({ token: 'mockToken' });
  }),
  googleSignup: jest.fn((req, res) => {
    res.status(201).json({ token: 'mockToken' });
  }),
}));

describe('Auth Routes', () => {
  it('should register a user', async () => {
    const user = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const response = await request(app).post('/auth/register').send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const user = { email: 'test@example.com', password: 'password123' };
    const response = await request(app).post('/auth/login').send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should login with Google', async () => {
    const response = await request(app).post('/auth/googlelogin').send({ /* Google login details */ });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should signup with Google', async () => {
    const response = await request(app).post('/auth/googlesignup').send({ /* Google signup details */ });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
