const spotifyWebAPI = require("spotify-web-api-node");
const spotifyFunctions = require("../functions/spotifyFunctions");
const artistFunctions = require("../functions/artistFunctions");

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

exports.getRecommendedGenres = (req, res, next) => {
  // console.log("\nHello from recommendedGenres");

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
      // console.log("Error!", err);
      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

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

exports.getRecommendations = (req, res, next) => {
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
              spotifyFunctions.saveRecommendations(result.body.tracks);
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
              spotifyFunctions.saveRecommendations(result.body.tracks);
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
};
