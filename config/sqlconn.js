const Sequelize = require("sequelize");

const conn = new Sequelize(
  process.env.MSSQLDB,
  // process.env.MSSQLUSER,
  // process.env.MSSQLUSERPWD,
  process.env.AZUREADMIN,
  process.env.AZUREADMINPWD,
  {
    // host: "localhost",
    host: process.env.AZUREHOST,
    dialect: "mssql",

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    dialectOptions: {
      options: { encrypt: true, trustServerCertificate: true },
    },
  }
);
module.exports = conn;
