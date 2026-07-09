import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import User from '../models/User.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test database if possible, or ensure we don't wipe prod data
    // For simplicity in this assignment, we rely on the existing connection but clean up created users
    // Ideally use mongodb-memory-server
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    // Don't close connection as it hangs with --detectOpenHandles sometimes if efficient
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
