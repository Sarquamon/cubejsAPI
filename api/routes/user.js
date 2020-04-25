const express = require("express");
const usersController = require("../controllers/userController");
const checkToken = require("../middleware/checkToken");

const router = express.Router();

router.get("/", usersController.userRoot);

router.post("/login", usersController.userLogin);

router.post("/register", usersController.userRegister);

router.post("/forgot", usersController.userForgot);

router.post("/checkToken", checkToken);

router.post("/recoverPwd", usersController.userRecover);

module.exports = router;
