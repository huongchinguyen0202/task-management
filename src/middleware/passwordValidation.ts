import { Request, Response, NextFunction } from 'express';

// Password must be at least 8 chars, include upper, lower, number, special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export function validatePasswordStrength(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters and include upper, lower, number, and special character.'
    });
  }
  next();
}
