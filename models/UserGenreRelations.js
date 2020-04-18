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
    ID_GENRE: {
      type: Sequelize.STRING(100),
      references: {
        model: Genres,
        key: "ID_GENRE",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = userGenreRel;
