import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const basedir = __dirname;

function getFilename(file: string) {
  return path.parse(file).name;
}

const files = fs.readdirSync(basedir).filter((file) => path.parse(file).name !== "index");

for (const file of files) {
  try {
    const { router: subRouter }: { router: express.Router } = await import(`./${file}`);
    router.use(`/${path.parse(file).name}`, subRouter);
  } catch (err) {
    const log = (await import('@/utils/logger.js')).default;
    log.error({ err, file }, `Failed to mount route ${file}`);
  }
}

export default router;
