const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const spotifyFunctions = require("./spotifyFunctions");
const { Op } = require("sequelize");
const sgMail = require("@sendgrid/mail");

const musictasteapidev = "http://localhost:3000/";
const musictasteapimaster = "https://musictasteapi.azurewebsites.net/";

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

exports.sendPasswordRecover = async (user) => {
  const token = jwt.sign(
    { string: spotifyFunctions.randomString(20) },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );

  const msg = {
    from: {
      email: "salo711@hotmail.com",
    },
    personalizations: [
      {
        to: [
          {
            email: user.USEREMAIL,
          },
        ],
        dynamic_template_data: {
          name: user.USERNAME,
          url: `${musictasteapimaster}recoverpwd?token=${token}&anduseremail=${user.USEREMAIL}`,
        },
      },
    ],
    template_id: "d-1d848ef301c24c8cb6f6963efbab76ab",
  };

  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error.response.body);
  }
};

exports.sendPasswordChange = async (userEmail) => {
  const msg = {
    from: {
      email: "salo711@hotmail.com",
    },
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        dynamic_template_data: {
          name: userEmail,
        },
      },
    ],
    template_id: "d-3480a559f75440929162432b00cc2a12",
  };

  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error.response.body);
  }
};
