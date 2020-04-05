const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const CORS = require("cors");
require("dotenv").config();
const conn = require("./config/sqlconn");

const app = express();

app.use(CORS()); //CORS
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

conn
  .authenticate()
  .then(() => console.log(`Succesful db connection`))
  .catch(err => {
    console.log(`Error on db connection: \n${err}`);
  });

//routes
const indexRoute = require("./api/routes/index");
const userRoute = require("./api/routes/user");
const spotifyRoute = require("./api/routes/spotiWrapper");

app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/spotify", spotifyRoute);

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
