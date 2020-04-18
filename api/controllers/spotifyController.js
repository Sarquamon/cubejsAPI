const spotifyWebAPI = require("spotify-web-api-node");
const spotifyFunctions = require("../functions/spotifyFunctions");
const artistFunctions = require("../functions/artistFunctions");
const userFunctions = require("../functions/userFunctions");
const genreFunctions = require("../functions/genreFunctions");

const spotiAPI = new spotifyWebAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

exports.spotifyRoot = (req, res, next) => {
  // console.log("\nHello from root spotify");
  res.status(200).json({ Message: "Hello from root spotify" });
  next();
};

exports.spotifyLinkGenerator = (req, res, next) => {
  // console.log("\nHello from spotify link generator");

  const authURL = spotiAPI.createAuthorizeURL(
    ["user-library-read", "user-top-read"],
    spotifyFunctions.randomString(16)
  );
  //   console.log("authURL\n", authURL);
  if (authURL) {
    res.status(200).json({ Message: "Link generated!", authURL: authURL });
  } else {
    res
      .status(500)
      .json({ Message: "Error!", Details: "Unable to generate link" });
  }
};

exports.spotifyTokenGenerator = (req, res, next) => {
  // console.log("\nhello from generateToken");

  const { code } = req.query;

  spotiAPI
    .authorizationCodeGrant(code)
    .then((result) => {
      //   console.log({ Message: "Success!", code: code, result: result });

      spotiAPI.setAccessToken(result.body["access_token"]);
      spotiAPI.setRefreshToken(result.body["refresh_token"]);

      console.log("\nredirecting...\n");

      res.redirect("http://localhost:3000/tests");
    })
    .catch((err) => {
      // console.log("Error! failed to get auth code\n" , err);

      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.tokenRefresher = (req, res, next) => {
  // console.log("\nhello from refreshtoken");

  spotiAPI
    .refreshAccessToken()
    .then((result) => {
      //   console.log("The token has been refreshed!");

      spotiAPI.setAccessToken(result.body["access_token"]);
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.getUserName = (req, res, next) => {
  // console.log("\nHello from getusername");

  spotiAPI
    .getMe()
    .then((result) => {
      // console.log("Success!\n", result);
      res.status(200).json({
        Message: "Success!",
        Details: result.body,
      });
    })
    .catch((err) => {
      //   console.log(`Error! ${err}`);
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
              // console.log("Success!\n", result);
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
        console.log("Error! Null\n");
        res.status(500).json({
          Message: "Error!",
          Details: "Null",
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

//Artists
exports.getUserTopArtists = (req, res, next) => {
  // console.log("Hello from get user top artists");
  const { userId } = req.params;

  spotiAPI
    .getMyTopArtists({ time_range: "long_term" })
    .then((result) => {
      console.log("Success! got all top artists");

      const artists = result.body.items;

      artists.forEach(async (artist) => {
        await artistFunctions.saveUserTopArtists(artist.id, artist.name);
        await artistFunctions.saveUserArtistRelation(
          userId,
          artist.id,
          artist.name
        );
      });
      // console.log(result);
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
      console.log(err);
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

//CHANGE LOGIC TO IMPLEMENT RECOMMENDATIONS BASED ON GENRES IF NO ARTIST IS AVAILABLE
exports.getRecommendedArtists = (req, res, next) => {
  // console.log("Hello from getSpotifyReco");

  const { userId } = req.params;

  artistFunctions
    .findAllUserTopArtist(userId)
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
          spotiAPI
            .getRecommendations({
              min_energy: 0.4,
              seed_artists: [
                "74XFHRwlV6OrjEM0A2NCMF",
                "3AA28KZvwAUcZuOKwyblJQ",
                "7jy3rLJdDQY21OgRLCZ9sD",
              ],
              min_popularity: 80,
            })
            .then((result) => {
              // console.log("Success!\n", result);
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
        }
      } else {
        //IF NO USER ARTIST RELATION MAKE A FALSE RECOMMENDATION BUT DONT STORE IT (TO DO)
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
};
