const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");

const User = conn.define(
  "t_users",
  {
    USER__ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    USER__NAME: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false
    },
    USER__EMAIL: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false
    },
    USER__PWD: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    USER__FIRST_NAME: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    USER__LAST_NAME: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  },
  { timestamps: false }
);

module.exports = User;
