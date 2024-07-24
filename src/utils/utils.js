require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 12;


const encryptPassword = async (password)=> {
  return await bcrypt.hash(password, saltRounds);
}

const checkingPassword = (plaintext, hash) => {
  console.log(plaintext);
  console.log(hash);
  return bcrypt.compareSync(plaintext, hash);
};

const signSession = (loadedUser) => {
  return jwt.sign(loadedUser, process.env.SECRET_KEY, {
    expiresIn: 3600 * 24 * 30.44 * 3,
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
