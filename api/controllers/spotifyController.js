const spotifyWebAPI = require("spotify-web-api-node");
const spotifyFunctions = require("./spotifyFunctions");
const { Op } = require("sequelize");

const spotiAPI = new spotifyWebAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

exports.spotifyRoot = (req, res, next) => {
  console.log("\nHello from root spotify");
  res.status(200).json({ Message: "Hello from root spotify" });
  next();
};

exports.spotifyLinkGenerator = (req, res, next) => {
  console.log("\nHello from spotify link generator");

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
  console.log("\nhello from generateToken");

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
      console.log("Error!\n", err);

      res.status(500).json({
        Message: "Error!",
        Details: err,
      });
    });
};

exports.tokenRefresher = (req, res, next) => {
  console.log("\nhello from refreshtoken");

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
  console.log("\nHello from getusername");

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
