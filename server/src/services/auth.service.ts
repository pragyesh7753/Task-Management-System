import { prisma } from '../config/prisma.js';
import { hashPassword, comparePassword, hashToken, compareToken } from '../utils/hash.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  getRefreshTokenExpiry,
} from '../utils/jwt.js';

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw { statusCode: 400, message: 'Email already registered' };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const tokenHash = await hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: decoded.userId, revoked: false },
  });

  let matchedToken = null;
  for (const token of tokens) {
    const isMatch = await compareToken(refreshToken, token.tokenHash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw { statusCode: 401, message: 'Invalid refresh token' };
  }

  if (matchedToken.expiresAt < new Date()) {
    throw { statusCode: 401, message: 'Refresh token expired' };
  }

  await prisma.refreshToken.update({
    where: { id: matchedToken.id },
    data: { revoked: true },
  });

  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);
  const newTokenHash = await hashToken(newRefreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: decoded.userId,
      tokenHash: newTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken: string, accessToken?: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.userId, revoked: false },
    });

    for (const token of tokens) {
      const isMatch = await compareToken(refreshToken, token.tokenHash);
      if (isMatch) {
        await prisma.refreshToken.update({
          where: { id: token.id },
          data: { revoked: true },
        });
        break;
      }
    }

    // Blacklist access token if provided
    if (accessToken) {
      try {
        const accessDecoded = verifyAccessToken(accessToken);
        const expiresAt = new Date(accessDecoded.exp! * 1000);
        await prisma.blacklistedToken.create({
          data: { token: accessToken, expiresAt },
        });
      } catch (err) {
        // Token already expired or invalid
      }
    }
  } catch (error) {
    // Silent fail for logout
  }
};
