import "dotenv/config";
import express from "express";
import { createServer, Server as HttpsServer } from "https";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";
import router from "@/routes/index.js";
import dbConnection from "@/db/config/db.js";
import setupSocketIO from "@/utils/socketManager.js";
import { setupEmployeeLocationNamespace } from "@/routes/locations.js";
import { setupEmployeeNamespace } from "@/routes/employees.js";
import { requestLogger } from "@/middlewares/requestLogger.js";
import logger from "@/utils/logger.js";
import mongoose from "mongoose";

const app = express();
let port: string | number = "";

if (process.env.DEV_STATUS === "development") {
  port = process.env.PORT_DEV || 8080;
} else {
  port = process.env.PORT_PROD || 8080;
}

const key = fs.readFileSync(process.env.SSL_KEY!, "utf-8");
const cert = fs.readFileSync(process.env.SSL_CERT!, "utf-8");

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);

if (process.env.DEV_STATUS !== "development") {
  const generalLimiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false });
  const authLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });
  app.use("/api", generalLimiter);
  app.use("/api/auth", authLimiter);
}

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage().rss,
  });
});

app.use("/api", router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: err.message });
});

const server: HttpsServer = createServer(
  { key, cert },
  app
);

dbConnection();

const io = setupSocketIO(server);
setupEmployeeNamespace(io);
setupEmployeeLocationNamespace(io);

server.listen(port, () =>
  logger.info({ port }, `Server listening on https://localhost:${port}`)
);
