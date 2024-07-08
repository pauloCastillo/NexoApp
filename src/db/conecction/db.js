require("dotenv").config();
const mongoose = require("mongoose");

async function dbConnection() {
  try {
    const db = await mongoose.connect(process.env.DB_URI, {
      dbName: "project-t2",
      minPoolSize: 50,
      family: 4,
    });
    console.log(`Successfully Connection with ${db.connection.name}`);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = dbConnection;
