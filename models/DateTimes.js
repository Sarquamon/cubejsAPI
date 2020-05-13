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
    DAY: {
      type: Sequelize.STRING(2),
      allowNull: true,
    },
    MONTH: {
      type: Sequelize.STRING(2),
      allowNull: true,
    },
    YEAR: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    HOUR: {
      type: Sequelize.STRING(4),
      allowNull: true,
    },
    MINUTE: {
      type: Sequelize.STRING(4),
      allowNull: true,
    },
    SECOND: {
      type: Sequelize.STRING(4),
      allowNull: true,
    },
    DATETIME: {
      type: Sequelize.STRING(19),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = DateTimes;
