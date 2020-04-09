const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");
const Artists = require("./Artists");
const DateTimes = require("./DateTimes");

const ArtistFacts = conn.define(
  "T_ARTIST_FACT",
  {
    ID_ARTIST_FACT: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ID_ARTIST: {
      type: Sequelize.STRING(100),
      unique: true,
      references: {
        model: Artists,
        key: "ID_ARTIST",
      },
    },
    TIMES_RECOMMENDED: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    LIKES: {
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

module.exports = ArtistFacts;
