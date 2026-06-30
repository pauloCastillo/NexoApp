import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 12;

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const checkingPassword = (plaintext, hash) => {
  return bcrypt.compareSync(plaintext, hash);
};
// * 30.44 * 3
const signSession = (loadedUser) => {
  return jwt.sign(loadedUser, process.env.SECRET_KEY, {
    expiresIn: 3600 * 24,
  });
};

const verifyingSession = (token) => {
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY, {
      maxAge: 3600 * 24,
    });

    if (!verifiedToken) {
      throw Error("Algo salio mal con el token");
    } else {
      return verifiedToken;
    }
  } catch (error) {
    return { error: error.message };
  }
};

export { encryptPassword, checkingPassword, signSession, verifyingSession,  };
