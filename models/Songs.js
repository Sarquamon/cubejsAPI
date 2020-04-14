const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");

const Song = conn.define(
  "T_SPOTIFY_SONGS",
  {
    ID_SONG: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    SONG_NAME: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    CREATED_AT: {
      type: Sequelize.STRING(19),
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = Song;
