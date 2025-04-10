const express = require("express");
const {
  registerEmployee,
  loginEmployee,
} = require("../controllers/authsController");

const { verifiedToken } = require("../middlewares/verifyToken");
const { verifyCredentials } = require("../middlewares/verifyCredentials");

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", verifiedToken, verifyCredentials, loginEmployee);

module.exports = router;
