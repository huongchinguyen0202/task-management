console.log('--- app.ts starting ---');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { setSecurityHeaders } from './middleware/securityHeaders';
import routes from './routes';
import helmet from 'helmet';
import rateLimiter from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(setSecurityHeaders);
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// TODO: Add routes

app.get('/', (req, res) => {
  res.send('Task Management API is running');
});

app.get('/api/testConnectServer', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

app.get('/api/testConnectDB', async (req, res) => {
  try {
    const db = require('./db');
    const result = await db.testConnection();
    // Giả sử result.email là email trả về
    console.log('Email from DB:', result);
    console.log('Email from DB:', result?.email);
    res.status(200).json({ message: 'Database connection successful!', email: result?.email });
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : String(err);
    res.status(500).json({ message: 'Database connection failed', error: errorMessage });
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
