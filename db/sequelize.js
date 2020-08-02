// Load Libraries
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Db Connection
const sequelize = new Sequelize("patient_app", "root", process.env.DB_PASS, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
