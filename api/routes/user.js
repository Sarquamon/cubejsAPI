const express = require("express");
const usersController = require("../controllers/userController");
const router = express.Router();

router.get("/", usersController.userRoot);

router.post("/login", usersController.userLogin);

router.post("/register", usersController.userRegister);

module.exports = router;
