const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { token } = req.body;
  if (token) {
    try {
      const result = jwt.verify(token, process.env.JWT_KEY);
      console.log("Success!", result);

      res.status(200).json({
        Message: "Success!",
      });
    } catch (e) {
      res.status(401).json({
        Message: "Error! Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      Message: "Error! Unauthorized",
    });
  }
};
