const express = require("express");
const { createManagers } = require("../controllers/managersController");
const { createJobTitle } = require("../controllers/jobsTitleControllers");
const { verifyingSession } = require("../utils/utils");
const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();
// router.route("/").post(createManagers);
router.route("/").post(verifiedToken, createJobTitle);
module.exports = router;
