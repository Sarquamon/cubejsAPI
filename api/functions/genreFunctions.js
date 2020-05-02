const { Op } = require("sequelize");
const Genres = require("../../models/Genres");
const userGenres = require("../../models/UserGenreRelations");
const Users = require("../../models/Users");

userGenres.belongsTo(Genres, { foreingKey: "ID_GENRE" });
userGenres.belongsTo(Users, { foreingKey: "ID_USER" });

// Saves genre to DB
exports.saveGenre = (genreName) => {
  return Genres.create({
    GENRE_NAME: genreName,
  });
};

// Saves user genre relation
exports.saveRelation = (userId, genreName) => {
  return userGenres.create({
    ID_USER: userId,
    GENRE_NAME: genreName,
  });
};

// Finds one genre from DB
exports.findOneGenre = (genreName, genreCheckbox) => {
  return Genres.findOne({
    attributes: ["GENRE_NAME"],
    where: {
      [Op.or]: [
        { GENRE_NAME: genreName || null },
        { GENRE_CHECKBOX: genreCheckbox || null },
      ],
    },
  });
};

// Finds one user's genre relation from DB
exports.findOneUserGenre = (userId, genreName) => {
  return userGenres.findOne({
    attributes: ["ID_USER", "GENRE_NAME"],
    where: {
      ID_USER: userId,
      GENRE_NAME: genreName,
    },
  });
};

/**
 * Finds all user's genres relations from DB
 * @param {number} userId The userId
 * @returns {promise}      All genres related to a user
 */
exports.findAllUserGenre = (userId) => {
  return userGenres.findAll({
    attributes: ["ID_USER", "GENRE_NAME"],
    where: {
      ID_USER: userId,
    },
  });
};

// Saves user's favourite / liked / possible genres and relates them
// If no existing genre, runs function to save it and then relates
// eslint-disable-next-line consistent-return
exports.saveUserGenreRelation = async (userId, genreName, genreCheckbox) => {
  console.log(userId, genreName, genreCheckbox);

  try {
    const genre = await this.findOneGenre(genreName, genreCheckbox);

    if (genre) {
      const userGenre = await this.findOneUserGenre(
        userId,
        genreName || genre.dataValues.GENRE_NAME
      );

      if (userGenre) {
        console.log("A relation already exists!\n");
      } else {
        console.log("creating relation\n");
        try {
          await this.saveRelation(
            userId,
            genreName || genre.dataValues.GENRE_NAME
          );
          return true;
        } catch (err) {
          console.log("Error!", err);
          throw new Error(err);
        }
      }
    } else {
      console.log("Creating genre\n");
      try {
        await this.saveGenre(genreName);
        await this.saveRelation(userId, genreName);
        return true;
      } catch (err) {
        console.log("Error!", err);
        throw new Error(err);
      }
    }
  } catch (err) {
    console.log("Error!", err);
    throw new Error(err);
  }
};
