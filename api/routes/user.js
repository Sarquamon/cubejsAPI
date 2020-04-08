const express = require("express");
const router = express.Router();

const usersController = require("../controllers/userController");

router.get("/", usersController.userRoot);

router.post("/login", usersController.userLogin);

router.post("/register", usersController.userRegister);

module.exports = router;
