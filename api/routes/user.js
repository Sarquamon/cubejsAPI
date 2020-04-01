const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(redirect_uri);
  console.log(client_id);
  console.log(client_secret);

  res.send("H1 from user Root");
  console.log("Hi from user root!");
});

router.get("/login", (req, res, next) => {
  console.log("Hello from /login");

  res.status(200).json({ message: "Hello from /login" });
});

router.post("/register", (req, res, next) => {
  console.log("Hello from /register");

  res.status(200).json({ message: "Hello from /register" });
});

module.exports = router;
