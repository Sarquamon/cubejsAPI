const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hi from index root!");
  console.log("Hi from index root!");
  // next();
});

module.exports = router;
