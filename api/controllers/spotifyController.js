const SpotifyWebAPI = require("spotify-web-api-node");
const spotifyFunctions = require("../functions/spotifyFunctions");
const artistFunctions = require("../functions/artistFunctions");
const userFunctions = require("../functions/userFunctions");
const genreFunctions = require("../functions/genreFunctions");

const spotiAPI = new SpotifyWebAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URIDEV,
  // redirectUri: process.env.SPOTIFY_REDIRECT_URIMASTER,
});

exports.spotifyRoot = (req, res, next) => {
  res.status(200).json({ Message: "Hello from root spotify" });
  next();
};

exports.spotifyLinkGenerator = (req, res, next) => {
  const authURL = spotiAPI.createAuthorizeURL(
    ["user-library-read", "user-top-read"],
    spotifyFunctions.randomString(16)
  );
  if (authURL) {
    res.status(200).json({ Message: "Link generated!", authURL });
  } else {
    res
      .status(500)
      .json({ Message: "Error!", Details: "Unable to generate link" });
  }
};

exports.spotifyTokenGenerator = (req, res, next) => {
  const { code } = req.query;

  spotiAPI
    .authorizationCodeGrant(code)
    .then((result) => {
      spotiAPI.setAccessToken(result.body.access_token);
      spotiAPI.setRefreshToken(result.body.refresh_token);

      console.log("\nredirecting...\n");

      res.redirect("http://localhost:3000/linkSpotify");
      // res.redirect("https://musictastereact.herokuapp.com/tests");
    })
    .catch((err) => {
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.tokenRefresher = (req, res, next) => {
  spotiAPI
    .refreshAccessToken()
    .then((result) => {
      spotiAPI.setAccessToken(result.body.access_token);
    })
    .catch((err) => {
      console.log("Unable to refresh token!", err);

      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.getUserName = (req, res, next) => {
  spotiAPI
    .getMe()
    .then((result) => {
      res.status(200).json({
        Message: "Success!",
        Details: result.body,
      });
    })
    .catch((err) => {
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

// Genres
exports.getRecommendedGenres = async (req, res, next) => {
  const { userId } = req.params;
  if (userId) {
    const existingUser = await userFunctions.findOneUser("", "", userId);
    if (existingUser) {
      const userGenres = await genreFunctions.findAllUserGenre(userId);
      if (userGenres) {
        if (userGenres.length > 0) {
          const userTopGenres = [];
          if (userGenres.length < 5) {
            for (let i = 0; i < userGenres.length; i++) {
              userTopGenres.push(userGenres[i].dataValues.GENRE_NAME);
            }
          } else {
            for (let i = 0; i < 5; i++) {
              userTopGenres.push(userGenres[i].dataValues.GENRE_NAME);
            }
          }

          spotiAPI
            .getRecommendations({
              min_energy: 0.4,
              seed_genres: userTopGenres,
              min_popularity: 40,
            })
            .then((result) => {
              spotifyFunctions.saveRecommendedArtists(
                result.body.tracks,
                userId
              );
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
          console.log("No userGenre");

          res.status(404).json({
            Message: "Error!",
            Details: "No user genres!",
          });
        }
      } else {
        console.log("Error! Null User genres\n");
        res.status(500).json({
          Message: "Error!",
          Details: "Null User genres",
        });
      }
    } else {
      console.log("Error! No user found\n");
      res.status(404).json({
        Message: "Error!",
        Details: "No user found",
      });
    }
  } else {
    console.log("Error! No userId provided\n");
    res.status(404).json({
      Message: "Error!",
      Details: "No userId provided",
    });
  }
};

// Artists
exports.getUserTopArtists = (req, res, next) => {
  const { userId } = req.params;

  spotiAPI
    .getMyTopArtists({ time_range: "long_term" })
    .then((result) => {
      const artists = result.body.items;

      artists.forEach(async (artist) => {
        await artistFunctions.saveUserTopArtists(artist.id, artist.name);
        await artistFunctions.saveUserArtistRelation(
          userId,
          artist.id,
          artist.name
        );
      });
      if (result) {
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
      console.log("Error!\n", err);
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.getGenres = async (req, res, next) => {
  try {
    const result = await spotiAPI.getAvailableGenreSeeds();
    result.body.genres.forEach((genre) => {
      genreFunctions.saveGenre(genre);
    });
    res.status(200);
  } catch (e) {
    console.log("Error!\n", e);
    res.status(200);
  }
};

// CHANGE LOGIC TO IMPLEMENT RECOMMENDATIONS BASED ON GENRES IF NO ARTIST IS AVAILABLE
exports.getRecommendedArtists = async (req, res, next) => {
  const { userId } = req.params;
  if (userId) {
    const existingUser = await userFunctions.findOneUser(null, null, userId);
    if (existingUser) {
      const userArtists = await artistFunctions.findAllUserTopArtist(userId);
      if (userArtists) {
        if (userArtists > 0) {
          const userTopArtists = [];
          if (userArtists.length < 5) {
            for (let i = 0; i < userArtists.length; i++) {
              userTopArtists.push(userArtists[i].dataValues.ID_ARTIST);
            }
          } else {
            for (let i = 0; i <= 5; i++) {
              userTopArtists.push(userArtists[i].dataValues.ID_ARTIST);
            }
          }
          spotiAPI
            .getRecommendations({
              min_energy: 0.4,
              seed_artists: userTopArtists,
              min_popularity: 40,
            })
            .then((result) => {
              spotifyFunctions.saveRecommendedArtists(
                result.body.tracks,
                userId
              );
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
          // RECOMMEND BASED ON GENRES
          console.log("No user artists");

          const userGenres = await genreFunctions.findAllUserGenre(userId);
          if (userGenres) {
            if (userGenres.length > 0) {
              const userTopGenres = [];
              if (userGenres.length < 5) {
                for (let i = 0; i < userGenres.length; i++) {
                  userTopGenres.push(userGenres[i].dataValues.GENRE_NAME);
                }
              } else {
                for (let i = 0; i < 5; i++) {
                  userTopGenres.push(userGenres[i].dataValues.GENRE_NAME);
                }
              }

              spotiAPI
                .getRecommendations({
                  min_energy: 0.4,
                  seed_genres: userTopGenres,
                  min_popularity: 40,
                })
                .then((result) => {
                  spotifyFunctions.saveRecommendedArtists(
                    result.body.tracks,
                    userId
                  );
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
              console.log("No userGenre");

              res.status(404).json({
                Message: "Error!",
                Details: "No user genres!",
              });
            }
          } else {
            console.log("Error! Null userGenre\n");
            res.status(500).json({
              Message: "Error!",
              Details: "Null userGenre",
            });
          }
        }
      } else {
        console.log("Error! Null userGenre\n");
        res.status(500).json({
          Message: "Error!",
          Details: "Null userGenre",
        });
      }
    } else {
      console.log("Error! No user found\n");
      res.status(404).json({
        Message: "Error!",
        Details: "No user found",
      });
    }
  } else {
    console.log("Error! No userId provided\n");
    res.status(404).json({
      Message: "Error!",
      Details: "No userId provided",
    });
  }
};
