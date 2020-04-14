const factsFunctions = require("./factsFunctions");
exports.randomString = (length) => {
  var result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.saveRecommendations = (tracks, userId /* values */) => {
  // const tracks = [values[0]];
  // console.log("TRACKS:\n", tracks);

  tracks.forEach(async (track) => {
    await factsFunctions.saveRecommendedArtists(track.artists, userId);
  });
};
