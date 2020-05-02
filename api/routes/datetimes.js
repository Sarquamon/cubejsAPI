const express = require("express");
const DateTimes = require("../functions/dateTimesFunctions");

const router = express.Router();

router.post("/:msg", DateTimes.saveDateTime);

module.exports = router;
