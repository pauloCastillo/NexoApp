const express = require("express");
const {
  getEmployees,
  createEmployee,
  loginEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getEmployees);
router.post("/", createEmployee);
router.post("/", loginEmployee);

module.exports = router;
