const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");
const Users = require("./Users");
const Genres = require("./Genres");

const userGenreRel = conn.define(
  "T_USER_GENRES",
  {
    ID_GENRE_USER: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ID_USER: {
      type: Sequelize.INTEGER,
      references: {
        model: Users,
        key: "ID_USER",
      },
    },
    GENRE_NAME: {
      type: Sequelize.STRING(200),
      references: {
        model: Genres,
        key: "GENRE_NAME",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = userGenreRel;
