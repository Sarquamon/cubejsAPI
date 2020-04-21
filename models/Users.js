const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");

const User = conn.define(
  "T_USERS",
  {
    ID_USER: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    USERNAME: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    USEREMAIL: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: false,
    },
    USERPWD: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    FIRST_NAME: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    LAST_NAME: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    CREATED_AT: {
      type: Sequelize.STRING(19),
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = User;
