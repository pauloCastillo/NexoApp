const express = require("express");
const {
  getEmployees,
  createEmployee,
} = require("../controllers/employeeController");
const { verifyCredentials } = require("../middlewares/verifyCredentials");

const router = express.Router();

router.get("/", getEmployees);

module.exports = router;
