const express = require("express");
const spotifyWebAPI = require("spotify-web-api-node");
const spotifyController = require("../controllers/spotifyController");
const User = require("../../models/Users");
const Artist = require("../../models/Artists");
const userArtist = require("../../models/userArtistRelations");
const { Op } = require("sequelize");
const router = express.Router();

const spotiAPI = new spotifyWebAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

router.get("/", spotifyController.spotifyRoot);

router.get("/spotifyLinkGenerator", spotifyController.spotifyLinkGenerator);

router.get("/generateToken", spotifyController.spotifyTokenGenerator);

router.get("/refreshToken", spotifyController.tokenRefresher);

router.get("/getUserName", spotifyController.getUserName);

router.get("/getRecommendedGenres", (req, res, next) => {
  console.log("Hello from recommendedGenres");

  spotiAPI
    .getAvailableGenreSeeds()
    .then((result) => {
      // console.log("Success\n", result);

      res.status(200).json({
        Message: "Success!",
        Details: result.body.genres,
      });
    })
    .catch((err) => {
      console.log("Error!");
      console.log(err);
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
});

const storeArtist = async (artistId, artistName) => {
  return new Promise((resolve, reject) => {
    Artist.create({
      ID_ARTIST: artistId,
      ARTIST_NAME: artistName,
    })
      .then((result) => {
        console.log(`Success! Created artist`);
        resolve(true);
      })
      .catch((err) => {
        console.log(`Error creating artist 1 ${err}`);
        reject(false);
      });
  });
};

const storeUserArtist = async (userId, artistId) => {
  let userArtistSuccess = false;
  await userArtist
    .findOne({
      attributes: ["ID_USER", "ID_ARTIST"],
      where: {
        ID_USER: userId,
        ID_ARTIST: artistId,
      },
    })
    .then((result) => {
      if (result) {
        console.log("\nA relation already exists");
        userArtistSuccess = true;
      } else {
        console.log("\nCreating relation");
        // console.log("Creating");

        userArtist
          .create({
            ID_USER: userId,
            ID_ARTIST: artistId,
          })
          .then((result) => {
            console.log("Success! On relating user artist");
            // console.log(result);
            userArtistSuccess = true;
          })
          .catch((err) => {
            console.log("Error! On relating user artist");
            console.log(err);
            userArtistSuccess = false;
          });
      }
    })
    .catch((err) => {
      console.log("Error!", err);
      userArtistSuccess = false;
    });
  return userArtistSuccess;
};

const saveUsersTopArtists = async (artists, userId) => {
  const storedArtist = [];
  artists.forEach(async (artist) => {
    Artist.findOne({
      attributes: ["ID_ARTIST", "ARTIST_NAME"],
      where: {
        [Op.or]: [{ ID_ARTIST: artist.id }, { ARTIST_NAME: artist.name }],
      },
    })
      .then(async (result) => {
        if (result) {
          console.log("\nArtist found");
          await storeUserArtist(userId, artist.id);
          storedArtist.push(true);
        } else {
          console.log("\nArtist not found");
          await storeArtist(artist.id, artist.name);
          await storeUserArtist(userId, artist.id);
          storedArtist.push(true);
        }
      })
      .catch(async (err) => {
        console.log("Error!", err);
        storedArtist.push(false);
      });
  });
  return storedArtist;
};

router.get("/getUsersTopArtists/:userId", async (req, res, next) => {
  const { userId } = req.params;

  spotiAPI
    .getMyTopArtists({ time_range: "long_term" })
    .then(async (result) => {
      console.log("Success!");

      const artists = result.body.items;

      const storedUsersTopArtists = await saveUsersTopArtists(artists, userId);
      const storedUsersTopArtistsSuccess = storedUsersTopArtists.every(
        (e) => e === true
      );

      if (storedUsersTopArtistsSuccess) {
        res.status(200).json({
          Message: "Success!",
          Details: artists,
        });
      } else {
        res.status(500).json({
          Message: "Error!",
          Details: "Internal server error",
        });
      }
    })
    .catch((err) => {
      console.log("Error!");
      console.log(err);
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
});

const storeRecommendedArtists = (tracks) => {};

router.get("/getSpotifyRecommendations/:userId", (req, res, next) => {
  // console.log("Hello from getSpotifyReco");

  const { userId } = req.params;

  userArtist
    .findAll({
      attributes: ["ID_USER", "ID_ARTIST"],
      where: {
        ID_USER: userId,
      },
    })
    .then((result) => {
      if (result) {
        console.log("Making recommendations");
        // console.log(result);
        if (result.length > 0) {
          const userTopArtists = [];
          for (let i = 0; i < 5; i++) {
            userTopArtists.push(result[i].dataValues.ID_ARTIST);
          }
          spotiAPI
            .getRecommendations({
              min_energy: 0.4,
              seed_artists: userTopArtists,
              min_popularity: 40,
            })
            .then((result) => {
              // console.log("Success!\n", result);
              storeRecommendedArtists(result.body.tracks);
              res.status(200).json({
                Message: "Success!",
                Details: "Able to make recommendations",
                Tracks: result.body.tracks,
              });
            })
            .catch((err) => {
              console.log("Error!", err);
              res.status(500).json({
                Message: "Error!",
                Details: err,
              });
            });
        } else {
          spotiAPI
            .getRecommendations({
              min_energy: 0.4,
              seed_artists: [
                "74XFHRwlV6OrjEM0A2NCMF",
                "3AA28KZvwAUcZuOKwyblJQ",
                "7jy3rLJdDQY21OgRLCZ9sD",
              ],
              min_popularity: 40,
            })
            .then((result) => {
              // console.log("Success!\n", result);
              storeRecommendedArtists(result.body.tracks);
              res.status(200).json({
                Message: "Success!",
                Details: "Able to make recommendations",
                Tracks: result.body.tracks,
              });
            })
            .catch((err) => {
              console.log("Error!", err);
              res.status(500).json({
                Message: "Error!",
                Details: err,
              });
            });
        }
      } else {
        console.log("Error! No user artist relation");

        res.status(404).json({
          Message: "Error! could not make a recommendation",
          Details: "No user artist relation",
        });
      }
    })
    .catch((err) => {
      console.log("Error!", err);

      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
});

module.exports = router;
