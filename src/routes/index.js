const express = require("express");
const fs = require("fs");

const router = express.Router();
const basedir = __dirname;

function getFilename(file) {
  return file.split(".").shift();
}

fs.readdirSync(basedir).filter((file) => {
  const filename = getFilename(file);
  if (filename !== "index") {
    router.use(`/${filename}`, require(`./${file}`));
  }
});

module.exports = router;
