const express = require("express");
const {
  getEmployees,
  createEmployee,
  loginEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getEmployees);
router.post("/signup", createEmployee);
router.post("/login", loginEmployee);

module.exports = router;
