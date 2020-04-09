const ArtistFacts = require("../../models/ArtistsFacts");

exports.findOneArtistFact = async (artistId) => {
  try {
    const result = await ArtistFacts.findOne({
      attributes: ["ID_ARTIST", "TIMES_RECOMMENDED", "LIKES"],
      where: {
        ID_ARTIST: artistId,
      },
    });

    if (result) {
      // console.log("Success! found artist fact\n", result);
      return result;
    } else {
      console.log("Error! No artist found\n" /* , err */);
      return null;
    }
  } catch (err) {
    console.log("Error! failed findOneArtist promise\n" /* , err */);
    return null;
  }
};

exports.saveArtistFact = async (artistId, datetimeId) => {
  ArtistFacts.create({
    ID_ARTIST: artistId,
    ID_DATETIME: datetimeId,
  })
    .then((result) => {
      console.log("Success! Created artistFact\n" /* , result */);
    })
    .catch((err) => {
      console.log("Error! Could not create artist fact" /* , err */);
    });
};

exports.updateArtistFact = async (artistId, timesRecommended) => {
  ArtistFacts.update(
    {
      TIMES_RECOMMENDED: timesRecommended + 1,
    },
    {
      where: {
        ID_ARTIST: artistId,
      },
    }
  )
    .then((result) => {
      console.log("Success! Updated artist fact" /* , result */);
    })
    .catch((err) => {
      console.log("Error! Could not update artist fact" /* , err */);
    });
};
