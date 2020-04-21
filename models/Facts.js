const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");
const Users = require("./Users");
const Artists = require("./Artists");
const Songs = require("./Songs");
const Genres = require("./Genres");
const DateTimes = require("./DateTimes");

const Facts = conn.define(
  "T_FACTS",
  {
    ID_FACT: {
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
    ID_ARTIST: {
      type: Sequelize.STRING(100),
      references: {
        model: Artists,
        key: "ID_ARTIST",
      },
    },
    ID_SONG: {
      type: Sequelize.STRING(100),
      references: {
        model: Songs,
        key: "ID_SONG",
      },
    },
    GENRE_NAME: {
      type: Sequelize.STRING(200),
      references: {
        model: Genres,
        key: "GENRE_NAME",
      },
    },
    RECOMMENDED: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    LIKED: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    ID_DATETIME: {
      type: Sequelize.INTEGER,
      references: {
        model: DateTimes,
        key: "ID_DATETIME",
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = Facts;
