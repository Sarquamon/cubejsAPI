const express = require("express");
const router = express.Router();

const stateKey = "spotify_auth_state";

router.get("/", (req, res, next) => {
  console.log(redirect_uri);
  console.log(client_id);
  console.log(client_secret);

  res.send("H1 from user Root");
  console.log("Hi from user root!");
});

router.get("/login", (req, res, next) => {
  //   res.send("H1 from user login");
});

module.exports = router;
