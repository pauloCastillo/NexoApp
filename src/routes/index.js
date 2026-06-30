import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const basedir = __dirname;

function getFilename(file) {
  return file.split(".").shift();
}

const files = fs.readdirSync(basedir).filter((file) => {
  return getFilename(file) !== "index";
});

await Promise.all(
  files.map(async (file) => {
    const { router: subRouter } = await import(`./${file}`);
    router.use(`/${getFilename(file)}`, subRouter);
  })
);

export default router;
