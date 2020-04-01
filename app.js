const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const CORS = require("cors");
require("dotenv").config();

const app = express();

const indexRoute = require("./api/routes/index");
const userRoute = require("./api/routes/user");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//CORS
app.use(CORS());

app.use("/", indexRoute);
app.use("/user", userRoute);

//Error handling
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
