import "dotenv/config";
import express from "express";
import { createServer, Server as HttpsServer } from "https";
import { createServer as createHttpServer, Server as HttpServer } from "http";
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
import { requestId } from "@/middlewares/requestId.js";
import { normalizeError } from "@/utils/normalizeError.js";
import { catalogEntry } from "@/utils/errorCatalog.js";
import logger from "@/utils/logger.js";
import mongoose from "mongoose";

const app = express();
let port: string | number = "";

if (process.env.DEV_STATUS === "development") {
  port = process.env.PORT_DEV || 8080;
} else {
  port = process.env.PORT_PROD || 8080;
}

const allowedOrigins = process.env.CLIENT_URL?.split(",").map((s) => s.trim()).filter(Boolean);
if (process.env.DEV_STATUS !== 'development' && (!allowedOrigins || allowedOrigins.length === 0)) {
  throw new Error('CLIENT_URL must be set in production');
}
app.use(cors({ origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : [], credentials: allowedOrigins && allowedOrigins.length > 0 }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(helmet());
app.use(requestId);
app.use(requestLogger);

// rate-limit always (auth even in dev to prevent brute-force)
const generalLimiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage().rss,
  });
});

app.use("/api", router);

// 404 fallback — additive, returns unified contract
app.use((req: Request, res: Response) => {
  const requestId = (req as any).id;
  const entry = catalogEntry('NOT_FOUND');
  res.status(entry.statusCode).json({ message: entry.message, code: 'NOT_FOUND', requestId });
});

// safety net for errors outside proxies (express.json syntax, etc.)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).id;
  const appErr = normalizeError(err, requestId);
  const entry = catalogEntry(appErr.code);
  const message = appErr.message || entry.message;
  const log = (req as any).log ?? logger.child({ requestId });
  log.error({ err, code: appErr.code, statusCode: appErr.statusCode, requestId, technical: (appErr as any).technical ?? (err instanceof Error ? err.message : String(err)) }, 'Unhandled error');
  const isDev = process.env.DEV_STATUS === 'development';
  res.status(appErr.statusCode).json({
    message,
    code: appErr.code,
    requestId,
    ...(appErr.errors && { errors: appErr.errors }),
    ...(isDev && { debug: { technical: (appErr as any).technical ?? (err instanceof Error ? err.message : String(err)), stack: err instanceof Error ? err.stack : undefined } }),
  });
});

const isDev = process.env.DEV_STATUS === "development";

let server: HttpServer | HttpsServer;

if (isDev) {
  server = createHttpServer(app);
} else {
  const key = fs.readFileSync(process.env.SSL_KEY!, "utf-8");
  const cert = fs.readFileSync(process.env.SSL_CERT!, "utf-8");
  server = createServer({ key, cert }, app);
}

dbConnection();

const io = setupSocketIO(server as any);
setupEmployeeNamespace(io);
setupEmployeeLocationNamespace(io);

server.listen(port, () => {
  const proto = isDev ? "http" : "https";
  logger.info({ port }, `Server listening on ${proto}://localhost:${port}`);
});
