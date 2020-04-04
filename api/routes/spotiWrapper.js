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

router.get("/generateToken/:code", (req, res, next) => {});

router.get("/refreshToken", (req, res, next) => {});

module.exports = router;
