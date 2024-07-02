const express = require("express");
const {
  getEmployee,
  createEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getEmployee);
router.post("/", createEmployee);

module.exports = router;
