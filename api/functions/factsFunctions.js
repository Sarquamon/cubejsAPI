const Facts = require("../../models/Facts");
const artistFunctions = require("./artistFunctions");
const dateTimesFunctions = require("../functions/dateTimesFunctions");

exports.saveArtistFact = async (
  userId,
  datetimeId,
  artistId,
  songId,
  genreId,
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
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
    } else if (liked) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_ARTIST: artistId,
        LIKED: 1,
      })
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
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
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
    } else if (liked) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_SONG: songId,
        LIKED: 1,
      })
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
    } else {
      console.log("Error!\n");
    }
  } else if (genreId) {
    if (recommended) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_GENRE: genreId,
        RECOMMENDED: 1,
      })
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
    } else if (liked) {
      Facts.create({
        ID_USER: userId,
        ID_DATETIME: datetimeId,
        ID_GENRE: genreId,
        LIKED: 1,
      })
        .then((result) => {
          console.log("Success! Created artistFact\n" /* , result */);
        })
        .catch((err) => {
          console.log("Error! Could not create artist fact" /* , err */);
        });
    } else {
      console.log("Error!\n");
    }
  }
};

exports.saveRecommendedArtists = async (artists, userId) => {
  // console.log("testing:\n", artists);
  artists.forEach((artist) => {
    artistFunctions
      .findOneArtist(artist.id, artist.name)
      .then(async (result) => {
        // console.log("Success!", result);
        if (result) {
          // console.log("Existing artist", result);
          try {
            const id_datetime = await dateTimesFunctions.saveDateTime(
              "ARTISTS"
            );
            await this.saveArtistFact(
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
              // result
            );
            await artistFunctions.saveArtist(artist.id, artist.name);
            const id_datetime = await dateTimesFunctions.saveDateTime(
              "ARTISTS"
            );
            await this.saveArtistFact(
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
      .catch((err) => {
        console.log("Error! On finding artist\n", err);
      });
  });
};
