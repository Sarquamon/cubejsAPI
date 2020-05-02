const factsFunctions = require("./factsFunctions");

exports.randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.saveRecommendedArtists = (tracks, userId) => {
  tracks.forEach(async (track) => {
    await factsFunctions.saveRecommendedArtists(track.artists, userId);
  });
};
