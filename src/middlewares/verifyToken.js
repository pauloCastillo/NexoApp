import {  verifyingSession  } from '../utils/utils.js';

const verifiedToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ").pop();
  if (!token) {
    res.status(400).json({ message: "token required" });
  } else {
    verifyingSession(token);
    next();
  }
};

export { verifiedToken,  };
