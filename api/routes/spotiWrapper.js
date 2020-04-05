const express = require("express");
const spotifyWebAPI = require("spotify-web-api-node");
const router = express.Router();

const spotiAPI = new spotifyWebAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const randomString = length => {
  var result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.get("/", (req, res, next) => {
  console.log("Hello from root spotify");
  res.status(200).json({ Message: "Hello from root spotify" });
  next();
});

router.get("/spotifyLinkGenerator", (req, res, next) => {
  console.log("Hello from spotify link generator");

  const authURL = spotiAPI.createAuthorizeURL(
    ["user-library-read", "user-top-read"],
    randomString(16)
  );
  console.log(authURL);
  if (authURL) {
    res.status(200).json({ Message: `Link generated!`, authURL: authURL });
  } else {
    res
      .status(500)
      .json({ Message: `Error!`, Details: "Unable to generate link" });
  }
});

router.get("/generateToken", (req, res, next) => {
  console.log("hello from generateToken");

  const { code } = req.query;
  spotiAPI
    .authorizationCodeGrant(code)
    .then(result => {
      console.log({ Message: "Success!", code: code, result: result });

      spotiAPI.setAccessToken(result.body["access_token"]);
      spotiAPI.setRefreshToken(result.body["refresh_token"]);

      console.log("redirecting");

      res.redirect("http://localhost:3000/tests");
    })
    .catch(err => {
      console.log(`Error!`);
      console.log(err);

      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

router.get("/refreshToken", (req, res, next) => {
  console.log("hello from refreshtoken");

  spotiAPI
    .refreshAccessToken()
    .then(result => {
      console.log("The token has been refreshed!");
      //   console.log(result);

      spotiAPI.setAccessToken(result.body["access_token"]);
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

router.get("/getUserName", (req, res, next) => {
  console.log("Hello from getusername");

  spotiAPI
    .getMe()
    .then(result => {
      console.log(`Success! ${result}`);
      res.status(200).json({
        Message: "Success!",
        Details: result.body
      });
    })
    .catch(err => {
      console.log(`Error! ${err}`);
      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

router.get("/getRecommendedGenres", (req, res, next) => {
  console.log("Hello from recommendedGenres");

  spotiAPI
    .getAvailableGenreSeeds()
    .then(result => {
      console.log("Success");

      console.log(result);
      res.status(200).json({
        Message: "Success!",
        Details: result.body.genres
      });
    })
    .catch(err => {
      console.log("Error!");
      console.log(err);
      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

router.get("/getUsersTopArtists", (req, res, next) => {
  console.log("Hello from get usersTopArtists");
  spotiAPI
    .getMyTopArtists({ time_range: "long_term" })
    .then(result => {
      console.log("Success!");
      console.log(result.body);

      res.status(200).json({
        Message: "Success!",
        Details: result.body
      });
    })
    .catch(err => {
      console.log("Error!");
      console.log(err);
      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

router.get("/getSpotifyRecommendations", (req, res, next) => {
  console.log("Hello from getSpotifyReco");
  spotiAPI
    .getRecommendations({
      min_energy: 0.4,
      seed_artists: ["6mfK6Q2tzLMEchAr0e9Uzu", "4DYFVNKZ1uixa6SQTvzQwJ"],
      min_popularity: 50
    })
    .then(result => {
      console.log("Success!");
      console.log(result);

      res.status(200).json({
        Message: "Success!",
        Details: result
      });
    })
    .catch(err => {
      console.log("Error!");
      console.log(err);

      res.status(500).json({
        Message: "Error!",
        Details: err
      });
    });
});

module.exports = router;
