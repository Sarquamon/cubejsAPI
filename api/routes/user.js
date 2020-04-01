const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("H1 from user Root");
  console.log("Hi from user root!");
  //   next();
});

router.get("/login", (req, res, next) => {
  res.send("H1 from user login");
  console.log("Hi from login!");
  //   next();
});

router.get("/callback", (req, res, next) => {
  res.send("H1 from user callback");
  console.log("Hi from callback!");
  //   next();
});

router.get("/refresh_token", (req, res, next) => {
  res.send("H1 from user refresh");
  console.log("Hi from refresh!");
  //   next();
});

module.exports = router;
