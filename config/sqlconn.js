const Sequelize = require("sequelize");

module.exports = new Sequelize(
  process.env.MSSQLDB,
  process.env.MSSQLUSER,
  process.env.MSSQLUSERPWD,
  {
    host: "localhost",
    dialect: "mssql",

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
