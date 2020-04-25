const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sgMail = require("@sendgrid/mail");
const CORS = require("cors");
require("dotenv").config();
const conn = require("./config/sqlconn");

const app = express();

app.use(CORS()); //CORS
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

conn
  .authenticate()
  .then(() => console.log(`Succesful auth`))
  .catch((err) => console.log("Error on db connection:", err));

conn
  .sync({ force: false })
  .then((result) => console.log("Successful db connection"))
  .catch((err) => console.log("Error!", err));

//routes
const indexRoute = require("./api/routes/index");
const userRoute = require("./api/routes/user");
const spotifyRoute = require("./api/routes/spotify");
const datetimes = require("./api/routes/datetimes");

app.use("/", indexRoute);
app.use("/user", userRoute);
app.use("/spotify", spotifyRoute);
app.use("/datetimes", datetimes);

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
      message: error.message,
    },
  });
});

module.exports = app;
