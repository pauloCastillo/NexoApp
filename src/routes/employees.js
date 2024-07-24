const express = require("express");
const {
  getEmployees,
  createEmployee,
  loginEmployee,
} = require("../controllers/employeeController");
const { verifyCredentials } = require("../middlewares/verifyCredentials");

const router = express.Router();

router.get("/", getEmployees);
router.route("/signup").post(createEmployee);
router.route("/login").post(verifyCredentials, loginEmployee);

module.exports = router;
