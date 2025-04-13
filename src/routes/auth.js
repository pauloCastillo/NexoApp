const express = require("express");
const {
  registerEmployee,
  loginEmployee,
} = require("../controllers/authsController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", verifiedToken, loginEmployee);

module.exports = router;
