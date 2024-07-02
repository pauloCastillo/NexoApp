require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/routes");
const { dbConnection } = require("./src/db/conecction/db");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

dbConnection();

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
