const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");

const DateTimes = conn.define(
  "T_DATETIMES",
  {
    ID_DATETIME: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    MSG: {
      type: Sequelize.STRING(8),
      allowNull: true,
    },
    DATE: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    TIME: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = DateTimes;
