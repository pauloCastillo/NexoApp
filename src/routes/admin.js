const express = require("express");
const { createManagers } = require("../controllers/managersController");
const { createJobTitle } = require("../controllers/jobController");
const { verifyingSession } = require("../utils/utils");
const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();
// router.route("/").post(createManagers);
router.route("/").post(verifiedToken, createJobTitle);
module.exports = router;
