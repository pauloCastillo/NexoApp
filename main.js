require("dotenv").config();
const express = require("express");
const { createServer} = require("https");
const fs = require("fs");
const cors = require("cors");
const router = require("./src/routes");
const dbConnection = require("./src/db/config/db");
const setupSocketIO = require("./src/utils/socketManager");
const { setupEmployeeNamespace } = require("./src/routes/employees");
const { setupEmployeeLocationNamespace } = require("./src/routes/locations");
const app = express();
let port = "";

if(process.env.DEV_STATUS === "development"){
  port = process.env.PORT_DEV;
}else{
  port = process.env.PORT_PROD;
}

const server = createServer({
  key: fs.readFileSync(process.env.SSL_KEY, "utf-8"),
  cert: fs.readFileSync(process.env.SSL_CERT, "utf-8"),
}, app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

dbConnection();

// Socket.io setup
const io = setupSocketIO(server);
setupEmployeeNamespace(io);
setupEmployeeLocationNamespace(io);

server.listen(port, () =>
  console.log(`Listening on port https://localhost:${port}`)
);
