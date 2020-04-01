const express = require("express");
const querystring = require("query-string");
const request = require("request");
const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const userData = [];

const generateRandomString = length => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

router.get("/", (req, res, next) => {
  console.log(redirect_uri);
  console.log(client_id);
  console.log(client_secret);

  res.send("H1 from user Root");
  console.log("Hi from user root!");
  //   next();
});

router.get("/login", (req, res, next) => {
  //   res.send("H1 from user login");
  console.log("Hi from login!");

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

router.get("/callback", (req, res, next) => {
  console.log("Hi from callback!");

  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "http://localhost:3000/#" +
        querystring.stringify({
          error: "state_mismatch"
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;

        const options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          //   console.log(body);
          if (userData.length <= 0) {
            userData.push(body);
          } else {
            userData.pop();
            userData.push(body);
          }

          return res.redirect(
            "http://localhost:3000/#" +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
              })
          );
        });
      } else {
        res.redirect(
          "http://localhost:3000/#" +
            querystring.stringify({
              error: "invalid_token"
            })
        );
      }
    });
  }
});

router.get("/getUserData", (req, res, next) => {
  if (userData) {
    if (userData.length >= 1) {
      res.status(200).json({
        data: userData
      });
    } else {
      console.log("404 No user info");

      res.status(404).json({
        message: "No user info"
      });
    }
  } else {
    console.log("404 No user info");

    res.status(404).json({
      message: "No user info"
    });
  }
});

router.get("/refresh_token", (req, res, next) => {
  res.send("H1 from user refresh");
  console.log("Hi from refresh!");

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });

  //   next();
});

module.exports = router;
