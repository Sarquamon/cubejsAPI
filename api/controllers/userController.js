const User = require("../../models/Users");
const UserFunctions = require("../functions/userFunctions");
const genreFunctions = require("../functions/genreFunctions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRoot = (req, res, next) => {
  res.send("H1 from user Root");
};

exports.userLogin = (req, res, next) => {
  const { loginUsernameEmail, loginUserPassword } = req.body;

  UserFunctions.findOneUser(loginUsernameEmail, loginUsernameEmail)
    .then((result) => {
      if (result) {
        bcrypt.compare(loginUserPassword, result.USERPWD, (err, response) => {
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
              return res.status(200).json({
                Message: "Success!",
                Details: `Logged in as ${loginUsernameEmail}`,
                Data: data,
              });
            } else {
              return res
                .status(401)
                .json({ Message: "Error!", Details: "Auth Failed" });
            }
          } else {
            console.log("Error 3!\n", err);

            return res
              .status(401)
              .json({ Message: "Error 3!", Details: "Auth Failed" });
          }
        });
      } else {
        // console.log(`Error! User ${loginUsernameEmail} was not found`);
        res.status(404).json({
          Message: "Error!",
          Details: `User ${loginUsernameEmail} not found`,
          Data: result,
        });
      }
    })
    .catch((err) => {
      console.log("Error!", err);
      res.status(500).json({ Message: "Error!", Details: err });
    });
};

exports.userRegister = (req, res, next) => {
  const {
    registerUsername,
    registerUseremail,
    registerUserPassword,
    registerUserFirstName,
    registerUserLastName,
    checkBoxes,
  } = req.body;

  UserFunctions.findOneUser(registerUsername, registerUseremail)
    .then((user) => {
      if (!user) {
        bcrypt.hash(registerUserPassword, 10, (err, hashed) => {
          if (!err) {
            User.create({
              USERNAME: registerUsername,
              USEREMAIL: registerUseremail,
              USERPWD: hashed,
              FIRST_NAME: registerUserFirstName,
              LAST_NAME: registerUserLastName,
            })
              .then((result) => {
                const data = {
                  USERNAME: result.dataValues.USERNAME,
                  USEREMAIL: result.dataValues.USEREMAIL,
                  USER_ID: result.dataValues.ID_USER,
                };
                res.status(201).json({
                  Message: `Success! user ${registerUsername} created!`,
                  Data: data,
                });

                checkBoxes.forEach((genre) => {
                  genreFunctions.saveUserGenreRelation(
                    result.dataValues.ID_USER,
                    null,
                    genre
                  );
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
          `Error 1! user ${registerUsername} or email ${registerUseremail} already exists!`
        );
        res.status(409).json({
          Message: `Error 1! user ${registerUsername} or email ${registerUseremail} already exists!`,
        });
      }
    })
    .catch((err) => {
      console.log("Error 2!\n", err);
      res.status(500).json({ Message: "Error 2!", Error: err });
    });
};

exports.userForgot = async (req, res, next) => {
  const { forgotUsernameEmail } = req.body;
  if (forgotUsernameEmail) {
    res.status(200).json({
      Message: "Success!",
    });
    try {
      const user = await UserFunctions.findOneUser(
        forgotUsernameEmail,
        forgotUsernameEmail
      );

      if (user) {
        UserFunctions.sendPasswordRecover(user.dataValues);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(404).json({
      Message: "No username nor email provided",
    });
  }
};

exports.userRecover = async (req, res, next) => {
  const { userPwd, userEmail } = req.body;

  if (userPwd && userEmail) {
    const hash = await bcrypt.hash(userPwd, 10);

    try {
      const updated = await User.update(
        { USERPWD: hash },
        {
          where: {
            USEREMAIL: userEmail,
          },
        }
      );
      if (updated) {
        res.status(200).json({ Message: "Password updated" });
        UserFunctions.sendPasswordChange(userEmail);
      } else {
        res.status(500).json({ Message: "Internal Server Error" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ Message: "Empty field" });
  }
};
