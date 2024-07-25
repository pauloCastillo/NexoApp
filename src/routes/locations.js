const express = require("express");
const {
  registerTimeLocationEmployee,
  getTimeLocationEmployee,
} = require("../controllers/locationController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/:id", getTimeLocationEmployee);
router.post("/", verifiedToken, registerTimeLocationEmployee);

module.exports = router;
