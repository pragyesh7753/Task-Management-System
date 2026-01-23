import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as any
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as any
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  
  return new Date(Date.now() + value * multipliers[unit]);
};
