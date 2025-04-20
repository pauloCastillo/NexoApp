require("dotenv").config();
const express = require("express");
const { createServer} = require("https");
const fs = require("fs");
const { Server} = require("socket.io");
const cors = require("cors");
const router = require("./src/routes");
const dbConnection = require("./src/db/config/db");

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

const io = new Server(server,{
  cors:{
    origin:'*',  
    // origin: process.env.CLIENT_URL,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

dbConnection();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () =>
  console.log(`Listening on port https://localhost:${port}`)
);
