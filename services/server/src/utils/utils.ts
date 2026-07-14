import "dotenv/config";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const saltRounds = 12;

const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

const checkingPassword = (plaintext: string, hash: string): boolean => {
  return bcrypt.compareSync(plaintext, hash);
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT secret key is not defined');
  }
  return secret;
};

const signSession = (loadedUser: Record<string, any>) => {
  const payload = {
    employeeId: loadedUser._id || loadedUser.id,
    email: loadedUser.email,
    username: loadedUser.username,
    companyId: loadedUser.company || loadedUser.companyId || null,
    role: loadedUser.role || 'employee',
    userType: loadedUser.userType || 'employee',
  };
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: 3600 * 24, // 24h
  });
};

const signRefreshToken = (loadedUser: Record<string, any>) => {
  const payload = {
    employeeId: loadedUser._id || loadedUser.id,
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

const verifyingSession = (token: string): Record<string, any> => {
  try {
    const verifiedToken = jwt.verify(token, getJwtSecret()) as Record<string, string>;
    if (!verifiedToken) {
      throw new Error("Algo salio mal con el token");
    }
    return verifiedToken;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { error: message };
  }
};

const generateInviteCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export { 
  encryptPassword, 
  checkingPassword, 
  signSession, 
  signRefreshToken, 
  verifyingSession, 
  generateInviteCode,
  hashToken,
  verifyTokenHash,
};
