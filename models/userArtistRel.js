const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");
const Users = require("./Users");
const Artists = require("./Artists");

const userArtistRel = conn.define(
  "T_ARTISTS_USER",
  {
    ID_ARTIST_USER: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ID_USER: {
      type: Sequelize.INTEGER,
      references: {
        model: Users,
        key: "USER__ID",
      },
    },
    ID_ARTIST: {
      type: Sequelize.STRING(100),
      references: {
        model: Artists,
        key: "ID_ARTIST",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = userArtistRel;
