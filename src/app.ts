console.log('--- app.ts starting ---');
import express, { Request, Response, NextFunction } from 'express';
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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(setSecurityHeaders);
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// Log mọi request để debug (in ra cả body nếu có)
app.use((req, res, next) => {
  console.log('[REQUEST]', req.method, req.originalUrl, 'Headers:', req.headers, 'Body:', req.body);
  // Log response status khi response kết thúc
  res.on('finish', () => {
    console.log('[RESPONSE]', req.method, req.originalUrl, 'Status:', res.statusCode);
  });
  next();
});

// Bổ sung header CORS thủ công cho mọi response
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

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

// Xử lý lỗi toàn cục: luôn trả về JSON và log lỗi rõ ràng
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
