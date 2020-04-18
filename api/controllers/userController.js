const User = require("../../models/Users");
const UserFunctions = require("../functions/userFunctions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRoot = (req, res, next) => {
  res.send("H1 from user Root");
  console.log("Hi from user root!");
};

exports.userLogin = (req, res, next) => {
  // console.log("Hello from /login");

  const { USERNAME, USEREMAIL, USERPWD } = req.body;

  UserFunctions.findOneUser(USERNAME, USEREMAIL)
    .then((result) => {
      if (result) {
        bcrypt.compare(USERPWD, result.USERPWD, (err, response) => {
          if (!err) {
            if (response) {
              const token = jwt.sign(
                {
                  USERNAME: result.USERNAME,
                  USEREMAIL: result.USEREMAIL,
                  ID_USER: result.ID_USER,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "200h",
                }
              );
              const data = {
                ID_USER: result.ID_USER,
                USERNAME: result.USERNAME,
                USEREMAIL: result.USEREMAIL,
                token: token,
              };
              // console.log("Success!\n", data);
              return res.status(200).json({
                Message: "Success!",
                Details: `Logged in as ${USERNAME}`,
                Data: data,
              });
            } else {
              // console.log(`Error! ${response}`);
              return res
                .status(401)
                .json({ Message: "Error!", Details: "Auth Failed" });
            }
          } else {
            console.log(`Error 3! \n${err}`);

            return res
              .status(401)
              .json({ Message: "Error 3!", Details: "Auth Failed" });
          }
        });
      } else {
        console.log(`Error! User ${USERNAME} was not found`);
        res.status(404).json({
          Message: "Error!",
          Details: `User ${USERNAME} not found`,
          Data: result,
        });
      }
    })
    .catch((err) => {
      console.log(`Error! ${err}`);
      res.status(500).json({ Message: "Error!", Details: err });
    });
};

exports.userRegister = (req, res, next) => {
  // console.log("Hello from /register");

  const { USERNAME, USEREMAIL, USERPWD, FIRST_NAME, LAST_NAME } = req.body;

  UserFunctions.findOneUser(USERNAME, USEREMAIL)
    .then((user) => {
      if (!user) {
        bcrypt.hash(USERPWD, 10, (err, hashed) => {
          if (!err) {
            User.create({
              USERNAME: USERNAME,
              USEREMAIL: USEREMAIL,
              USERPWD: hashed,
              FIRST_NAME: FIRST_NAME,
              LAST_NAME: LAST_NAME,
            })
              .then((result) => {
                const data = {
                  USERNAME: result.dataValues.USERNAME,
                  USEREMAIL: result.dataValues.USEREMAIL,
                };
                // console.log("Success!\n", data);
                res.status(201).json({
                  Message: `Success! user ${USERNAME} created!`,
                  Data: data,
                });
              })
              .catch((err) => {
                console.log("Error 5!\n", err);
                res.status(500).json({ Message: "Error 5!", Error: err });
              });
          } else {
            console.log("Error! Failed hashing\n", err);
            res
              .status(500)
              .json({ Message: "Error! Failed Hashing", Details: err });
          }
        });
      } else {
        console.log(
          `Error 1! user ${USERNAME} or email ${USEREMAIL} already exists!`
        );
        res.status(409).json({
          Message: `Error 1! user ${USERNAME} or email ${USEREMAIL} already exists!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error 2!\n", err);
      res.status(500).json({ Message: "Error 2!", Error: err });
    });
};