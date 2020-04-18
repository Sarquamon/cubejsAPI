const express = require("express");
const spotifyController = require("../controllers/spotifyController");
const router = express.Router();

router.get("/", spotifyController.spotifyRoot);

router.get("/spotifyLinkGenerator", spotifyController.spotifyLinkGenerator);

router.get("/generateToken", spotifyController.spotifyTokenGenerator);

router.get("/refreshToken", spotifyController.tokenRefresher);

router.get("/getUserName", spotifyController.getUserName);

router.get(
  "/getRecommendedGenres/:userId",
  spotifyController.getRecommendedGenres
);

router.get("/getUsersTopArtists/:userId", spotifyController.getUserTopArtists);

router.get(
  "/getSpotifyRecommendations/:userId",
  spotifyController.getRecommendedArtists
);

module.exports = router;
