import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';

// Định nghĩa payload JWT với id luôn là number
interface JwtUserPayload {
  id: number;
  email: string;
  // ...add other fields if needed
}

interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Log request method, url, headers để debug
  console.log('[AUTH] Method:', req.method, 'URL:', req.originalUrl);
  console.log('[AUTH] Headers:', req.headers);

  // Nếu là preflight OPTIONS thì cho qua luôn (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'Preflight OK' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'JWT secret is not configured on the server' });
    }
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    req.user = decoded;
    console.log('[AUTH] User decoded:', decoded);
    next();
  } catch (err) {
    console.error('[AUTH] JWT error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
