const Artist = require("../../models/Artists");
const UserArtist = require("../../models/UserArtistRelations");
const ArtistFactsFunctions = require("./artistFactsFunctions");
const dateTimesFunctions = require("../functions/dateTimesFunctions");
const { Op } = require("sequelize");

exports.saveArtist = async (artistId, artistName) => {
  return Artist.create({
    ID_ARTIST: artistId,
    ARTIST_NAME: artistName,
  })
    .then((result) => {
      console.log(`Success! Created artist`);
    })
    .catch((err) => {
      console.log("Error creating artist", err);
    });
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
        console.log("\nExisting artist");
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
      //   console.log(result);
      if (result) {
        console.log("\nA relation already exists");
      } else {
        console.log("\nCreating relation");

        UserArtist.create({
          ID_USER: userId,
          ID_ARTIST: artistId,
        })
          .then((result) => {
            console.log("Success! On relating user artist");
            // console.log(result);
          })
          .catch((err) => {
            console.log("Error! On relating user artist");
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log("Error!\n", err);
    });
};

exports.saveRecommendedArtists = async (artists) => {
  // console.log("testing:\n", artists);
  artists.forEach((artist) => {
    this.findOneArtist(artist.id, artist.name)
      .then(async (result) => {
        // console.log("Success!", result);
        if (result) {
          // console.log("Existing artist", result);
          try {
            const artistFact = await ArtistFactsFunctions.findOneArtistFact(
              artist.id
            );
            if (artistFact) {
              //SI HAY ARTISTA Y TIENE REPUTACION UPDATE
              // console.log("Se tiene un artist fact", artistFact);

              try {
                await ArtistFactsFunctions.updateArtistFact(
                  artistFact.ID_ARTIST,
                  artistFact.TIMES_RECOMMENDED
                );
                // console.log("Success! Updated artist");
              } catch (err) {
                console.log("Error!\n", err);
              }
            } else {
              //DE LO CONTRARIO AGREGARLO Y DALE UNA REPUTACION DE 1
              // console.log("No tiene un artist fact", artistFact);
              try {
                const id_datetime = await dateTimesFunctions.saveDateTime(
                  "ARTISTS"
                );
                await ArtistFactsFunctions.saveArtistFact(
                  artist.id,
                  id_datetime
                );
                console.log("Success! Added artist");
              } catch (err) {
                console.log("Error!\n", err);
              }
            }
          } catch (err) {
            console.log("Error!\n", err);
          }
        } else {
          try {
            console.log(
              "No existing. Creating artist for recommendations\n"
              // result
            );
            await this.saveArtist(artist.id, artist.name);
            const id_datetime = await dateTimesFunctions.saveDateTime(
              "ARTISTS"
            );
            await ArtistFactsFunctions.saveArtistFact(artist.id, id_datetime);
          } catch (err) {
            console.log("Error!\n", err);
          }
        }
      })
      .catch((err) => {
        console.log("Error! On finding artist\n", err);
      });
  });
};
