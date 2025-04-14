const express = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();
// verifiedToken
router.route("/")
.get(verifiedToken, getAllEmployees)
.post(verifiedToken, createEmployee);

router.route("/:employee_id")
.get(verifiedToken, getEmployeeById)
.delete(verifiedToken, deleteEmployee);

module.exports = router;
