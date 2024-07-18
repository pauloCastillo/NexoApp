const express = require("express");
const { isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.get("/", isLoggedIn);

module.exports = router;
