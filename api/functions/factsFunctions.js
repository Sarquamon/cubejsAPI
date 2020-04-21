const Facts = require("../../models/Facts");
const artistFunctions = require("./artistFunctions");
const dateTimesFunctions = require("../functions/dateTimesFunctions");

exports.saveFact = async (
  userId,
  datetimeId,
  artistId,
  songId,
  recommended,
  liked
) => {
  if (artistId) {
    if (recommended) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_ARTIST: artistId,
        RECOMMENDED: 1,
      })
        .then((result) => console.log("Success! Created artistFact\n"))
        .catch((err) => console.log("Error! Could not create artist fact"));
    } else if (liked) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_ARTIST: artistId,
        LIKED: 1,
      })
        .then((result) => console.log("Success! Created artistFact\n"))
        .catch((err) => console.log("Error! Could not create artist fact"));
    } else {
      console.log("Error!\n");
    }
  } else if (songId) {
    if (recommended) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_SONG: songId,
        RECOMMENDED: 1,
      })
        .then((result) => console.log("Success! Created song fact\n"))
        .catch((err) =>
          console.log("Error! Could not create song fact" /* , err */)
        );
    } else if (liked) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_SONG: songId,
        LIKED: 1,
      })
        .then((result) => console.log("Success! Created song fact\n"))
        .catch((err) => console.log("Error! Could not create song fact"));
    } else {
      console.log("Error!\n");
    }
  }
};

exports.saveRecommendedArtists = async (artists, userId) => {
  artists.forEach((artist) => {
    artistFunctions
      .findOneArtist(artist.id, artist.name)
      .then(async (result) => {
        if (result) {
          try {
            const id_datetime = await dateTimesFunctions.saveDateTime(
              "ARTISTS"
            );
            await this.saveFact(
              userId,
              id_datetime,
              artist.id,
              null,
              null,
              true,
              null
            );
            console.log("Success! Created fact\n");
          } catch (err) {
            console.log("Error!\nError on creating fact\n", err);
          }
        } else {
          try {
            console.log(
              "No existing artist. Creating artist for recommendations\n"
            );
            await artistFunctions.saveArtist(artist.id, artist.name);
            const id_datetime = await dateTimesFunctions.saveDateTime(
              "ARTISTS"
            );
            await this.saveFact(
              userId,
              id_datetime,
              artist.id,
              null,
              null,
              true,
              null
            );
          } catch (err) {
            console.log("Error!\n", err);
          }
        }
      })
      .catch((err) => console.log("Error! On finding artist\n", err));
  });
};
