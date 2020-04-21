const User = require("../../models/Users");
const { Op } = require("sequelize");
exports.findOneUser = (userName, userEmail, userId) => {
  return User.findOne({
    attributes: ["ID_USER", "USERNAME", "USEREMAIL", "USERPWD"],
    where: {
      [Op.or]: [
        { USERNAME: userName || null },
        { USEREMAIL: userEmail || null },
        { ID_USER: userId || null },
      ],
    },
  });
};
