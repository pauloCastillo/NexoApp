require("dotenv").config();
const express = require("express");
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

dbConnection();

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
