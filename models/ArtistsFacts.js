const Sequelize = require("sequelize");
const conn = require("../config/sqlconn");
const Artists = require("./Artists");
const dateTimes = require("./DateTimes");

const ArtistsFacts = conn.define(
  "T_ARTIST_STATISTIC",
  {
    ID_ARTIST_FACT: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ID_ARTIST: {
      type: Sequelize.STRING(100),
      references: {
        model: Artists,
        key: "ID_ARTIST",
      },
    },
    TIMES_RECOMMENDED: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LIKES: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ID_DATETIME: {
      type: Sequelize.INTEGER,
      references: {
        model: dateTimes,
        key: "ID_DATETIME",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = ArtistsFacts;
