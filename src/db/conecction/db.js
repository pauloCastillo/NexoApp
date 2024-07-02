require("dotenv").config();
const mongoose = require("mongoose");

exports.dbConnection = async function () {
  try {
    const db = await mongoose.connect(process.env.DB_URI, {
      dbName: "T2-Project",
      minPoolSize: 50,
      family: 4,
    });
    return `Successfully Connection with ${db.dbName}`;
  } catch (error) {
    return error.message;
  }
};
