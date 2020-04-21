const Artist = require("../../models/Artists");
const UserArtist = require("../../models/UserArtistRelations");
const { Op } = require("sequelize");

exports.saveArtist = async (artistId, artistName) => {
  return Artist.create({
    ID_ARTIST: artistId,
    ARTIST_NAME: artistName,
  })
    .then((result) => console.log(`Success! Created artist`))
    .catch((err) => console.log("Error creating artist", err));
};

exports.findOneArtist = async (artistId, artistName) => {
  return Artist.findOne({
    attributes: ["ID_ARTIST", "ARTIST_NAME"],
    where: {
      [Op.or]: [{ ID_ARTIST: artistId }, { ARTIST_NAME: artistName }],
    },
  });
};

exports.findAllUserTopArtist = (userId) => {
  return UserArtist.findAll({
    attributes: ["ID_USER", "ID_ARTIST"],
    where: {
      ID_USER: userId,
    },
  });
};

exports.findOneUserTopArtist = (userId, artistId) => {
  return UserArtist.findOne({
    attributes: ["ID_USER", "ID_ARTIST"],
    where: {
      ID_USER: userId,
      ID_ARTIST: artistId,
    },
  });
};

exports.saveUserTopArtists = (artistId, artistName) => {
  return this.findOneArtist(artistId, artistName)
    .then((result) => {
      if (result) {
        console.log("Existing artist\n");
      } else {
        console.log("Creating artist");
        this.saveArtist(artistId, artistName);
      }
    })
    .catch((err) => {
      console.log("Error!\n", err);
    });
};

exports.saveUserArtistRelation = (userId, artistId) => {
  return this.findOneUserTopArtist(userId, artistId)
    .then((result) => {
      if (result) {
        console.log("\nA relation already exists");
      } else {
        console.log("\nCreating relation");

        UserArtist.create({
          ID_USER: userId,
          ID_ARTIST: artistId,
        })
          .then((result) => console.log("Success! On relating user artist"))
          .catch((err) => console.log("Error! On relating user artist\n", err));
      }
    })
    .catch((err) => console.log("Error!\n", err));
};
