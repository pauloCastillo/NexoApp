const express = require("express");
const {
  getAllEmployees,
} = require("../controllers/employeeController");

const router = express.Router();

router.route("/").get(getAllEmployees);

module.exports = router;
