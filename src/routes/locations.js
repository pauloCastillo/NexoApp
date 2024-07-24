const express = require("express");
const {
  registerTimeLocationEmployee,
  getTimeLocationEmployee,
} = require("../controllers/locationController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/:id", verifiedToken,  getTimeLocationEmployee);
router.post("/", registerTimeLocationEmployee);

module.exports = router;
