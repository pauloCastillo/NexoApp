import "dotenv/config";
import express from "express";
import { createServer, Server as HttpsServer } from "https";
import fs from "fs";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import router from "@/routes/index.js";
import dbConnection from "@/db/config/db.js";
import setupSocketIO from "@/utils/socketManager.js";
import { setupEmployeeLocationNamespace } from "@/routes/locations.js";
import { setupEmployeeNamespace } from "@/routes/employees.js";

const app = express();
let port: string | number = "";

if (process.env.DEV_STATUS === "development") {
  port = process.env.PORT_DEV || 8080;
} else {
  port = process.env.PORT_PROD || 8080;
}

const key = fs.readFileSync(process.env.SSL_KEY!, "utf-8");
const cert = fs.readFileSync(process.env.SSL_CERT!, "utf-8");

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const server: HttpsServer = createServer(
  { key, cert },
  app
);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

dbConnection();

const io = setupSocketIO(server);
setupEmployeeNamespace(io);
setupEmployeeLocationNamespace(io);

server.listen(port, () =>
  console.log(`Listening on port https://localhost:${port}`)
);
