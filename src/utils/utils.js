require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const saltRounds = 12;

const encryptPassword = async (password)=> {
  return await bcrypt.hash(password, saltRounds);
}

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
      maxAge: 60,
    });

    if (!verifiedToken) {
      throw Error("Algo salio mal con el token");
      return;
    } else {
      return verifiedToken;
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  encryptPassword,
  checkingPassword,
  signSession,
  verifyingSession,
};
