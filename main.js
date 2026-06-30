import "dotenv/config";
import express from "express";
import { createServer } from "https";
import fs from "fs";
import cors from "cors";
import router from "./src/routes/index.js";
import dbConnection from "./src/db/config/db.js";
import setupSocketIO from "./src/utils/socketManager.js";
import { setupEmployeeLocationNamespace } from "./src/routes/locations.js";
import { setupEmployeeNamespace } from "./src/routes/employees.js";

const app = express();
let port = "";

if (process.env.DEV_STATUS === "development") {
  port = process.env.PORT_DEV || 8080;
} else {
  port = process.env.PORT_PROD;
}

const server = createServer(
  {
    key: fs.readFileSync(process.env.SSL_KEY, "utf-8"),
    cert: fs.readFileSync(process.env.SSL_CERT, "utf-8"),
  },
  app
);

app.use(cors());
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
