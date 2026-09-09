import "dotenv/config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';

const saltRounds = 12;

const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

const checkingPassword = (plaintext: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plaintext, hash);
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT secret key is not defined');
  }
  return secret;
};

interface SessionPayload {
  _id?: string | Types.ObjectId;
  id?: string | Types.ObjectId;
  email?: string;
  username?: string;
  company?: string | null | Types.ObjectId;
  companyId?: string | null | Types.ObjectId;
  role?: string;
}

const signSession = (loadedUser: SessionPayload) => {
  const payload = {
    userId: String(loadedUser._id || loadedUser.id),
    email: loadedUser.email,
    username: loadedUser.username,
    companyId: String(loadedUser.company || loadedUser.companyId || null),
    role: loadedUser.role || 'employee',
  };
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: 3600 * 24, // 24h
  });
};

const signRefreshToken = (loadedUser: SessionPayload) => {
  const payload = {
    userId: String(loadedUser._id || loadedUser.id),
    type: 'refresh',
  };
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: 3600 * 24 * 7, // 7d
  });
};

const hashToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, saltRounds);
};

const verifyTokenHash = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};

const verifyingSession = (token: string): Record<string, string> => {
  const verifiedToken = jwt.verify(token, getJwtSecret()) as Record<string, string>;
  if (!verifiedToken) {
    throw new Error("Algo salio mal con el token");
  }
  return verifiedToken;
};

export { 
  encryptPassword, 
  checkingPassword, 
  signSession, 
  signRefreshToken, 
  verifyingSession, 
  hashToken,
  verifyTokenHash,
};
