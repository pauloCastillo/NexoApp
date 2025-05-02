const express = require("express");
const {
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
} = require("../controllers/locationController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/:id", getTimeLocationEmployee);
router.post("/", verifiedToken, registerEmployeesTimeLocation);

module.exports = {router};
