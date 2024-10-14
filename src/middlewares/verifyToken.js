const { verifyingSession } = require("../utils/utils");

const verifiedToken = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  const token = authorization.split(" ").pop();
  if (!token) {
    res.status(400).json({ message: "token required" });
  } else {
    verifyingSession(token);
    next();
  }
};

module.exports = {
  verifiedToken,
};
