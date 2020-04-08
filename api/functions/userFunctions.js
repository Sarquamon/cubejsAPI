const User = require("../../models/Users");
const { Op } = require("sequelize");
exports.findOneUser = (USERNAME, USEREMAIL) => {
  return User.findOne({
    attributes: ["ID_USER", "USERNAME", "USEREMAIL", "USERPWD"],
    where: {
      [Op.or]: [{ USERNAME: USERNAME }, { USEREMAIL: USEREMAIL }],
    },
  });
};
