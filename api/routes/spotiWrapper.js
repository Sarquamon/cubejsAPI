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
  const authURL = spotiAPI.createAuthorizeURL(
    ["user-library-read"],
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
  console.log("generateToken");

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
  spotiAPI
    .refreshAccessToken()
    .then(result => {
      console.log("The token has been refreshed!");
      console.log(result);

      spotifyApi.setAccessToken(result.body["access_token"]);
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

module.exports = router;
