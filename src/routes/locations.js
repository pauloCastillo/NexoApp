const express = require("express");
const {
  registerTimeLocationEmployee,
  getTimeLocationEmployee,
} = require("../controllers/locationController");

const router = express.Router();

router.get("/:id", getTimeLocationEmployee);
router.post("/", registerTimeLocationEmployee);

module.exports = router;
