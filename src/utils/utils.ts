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

const signSession = (loadedUser: Record<string, any>) => {
  const payload = {
    employeeId: loadedUser._id || loadedUser.id,
    email: loadedUser.email,
    username: loadedUser.username,
    companyId: loadedUser.company || loadedUser.companyId || null,
    role: loadedUser.role || 'employee',
    userType: loadedUser.userType || 'employee',
  };
  return jwt.sign(payload, process.env.SECRET_KEY!, {
    expiresIn: 3600 * 24,
  });
};

const verifyingSession = (token: string): Record<string, any> => {
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY!) as Record<string, any>;
    if (!verifiedToken) {
      throw new Error("Algo salio mal con el token");
    }
    return verifiedToken;
  } catch (error: any) {
    return { error: error.message };
  }
};

const generateInviteCode = (): string => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export { encryptPassword, checkingPassword, signSession, verifyingSession, generateInviteCode };
