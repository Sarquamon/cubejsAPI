const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");

const Artist = conn.define(
  "T_SPOTIFY_ARTISTS",
  {
    ID_ARTIST: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    ARTIST_NAME: {
      type: Sequelize.STRING(200),
      unique: true,
      allowNull: false,
    },
    CREATED_AT: {
      type: Sequelize.STRING(19),
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = Artist;
