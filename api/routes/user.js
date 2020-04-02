const express = require("express");
const User = require("../../models/Users");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(redirect_uri);
  console.log(client_id);
  console.log(client_secret);

  res.send("H1 from user Root");
  console.log("Hi from user root!");
});

router.get("/login", (req, res, next) => {
  console.log("Hello from /login");

  const { user__name, user__email, user__pwd } = req.body;

  User.findOne({
    attributes: ["USER__ID", "USER__NAME", "USER__EMAIL", "USER__PWD"],
    where: {
      [Op.or]: [{ USER__NAME: user__name }, { USER__EMAIL: user__email }]
    }
  })
    .then(result => {
      if (result) {
        // res.status(200).json({ result: result });
        bcrypt.compare(user__pwd, result.USER__PWD, (err, response) => {
          if (!err) {
            if (response) {
              const token = jwt.sign(
                {
                  USER__NAME: result.USER__NAME,
                  USER__EMAIL: result.USER__EMAIL,
                  USER__ID: result.USER__ID
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "200h"
                }
              );
              const data = {
                USER__NAME: result.USER__NAME,
                USER__EMAIL: result.USER__EMAIL
              };
              console.log(`Success! ${data}`);
              return res.status(200).json({
                Message: "Success!",
                Details: `Logged in as ${user__name}`,
                Data: data,
                token: token
              });
            } else {
              console.log(`Error! ${response}`);
              return res
                .status(401)
                .json({ Message: "Error!", Details: "Auth Failed" });
            }
          } else {
            console.log(`Error! \n${err}`);

            return res
              .status(401)
              .json({ Message: "Error!", Details: "Auth Failed" });
          }
        });
      } else {
        console.log(`Error! ${result}`);
        res.status(404).json({
          Message: "Error!",
          Details: `User ${user__name} not found`,
          Data: result
        });
      }
    })
    .catch(err => {
      console.log(`Error! ${err}`);
      res.status(500).json({ Message: "Error!", Details: err });
    });
});

router.post("/register", (req, res, next) => {
  console.log("Hello from /register");

  const {
    user__name,
    user__email,
    user__pwd,
    user__first_name,
    user__last_name
  } = req.body;

  User.findOne({
    attributes: ["USER__NAME", "USER__EMAIL"],
    where: {
      [Op.or]: [{ USER__NAME: user__name }, { USER__EMAIL: user__email }]
    }
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(user__pwd, 10, (err, hashed) => {
          if (!err) {
            User.create({
              USER__NAME: user__name,
              USER__EMAIL: user__email,
              USER__PWD: hashed,
              USER__FIRST_NAME: user__first_name,
              USER__LAST_NAME: user__last_name
            })
              .then(result => {
                const data = {
                  USER__NAME: result.dataValues.USER__NAME,
                  USER__EMAIL: result.dataValues.USER__EMAIL
                };
                console.log(`Success! \n${data}`);
                res.status(201).json({
                  Message: `Success! user ${user__name} created!`,
                  Data: data
                });
              })
              .catch(err => {
                console.log(`Error 5! ${err}`);
                res.status(500).json({ Message: "Error 5!", Error: err });
              });
          } else {
            console.log(`Error! Failed hashing \n${err}`);
            res
              .status(500)
              .json({ Message: "Error! Failed Hashing", Details: err });
          }
        });
      } else {
        console.log(
          `Error 1! user ${user__name} or email ${user__email} already exists!`
        );
        res.status(409).json({
          Message: `Error 1! user ${user__name} or email ${user__email} already exists!`
        });
      }
    })
    .catch(err => {
      console.log(`Error 2! ${err}`);
      res.status(500).json({ Message: "Error 2!", Error: err });
    });
});

module.exports = router;
