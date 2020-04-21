exports.indexRoot = (req, res, next) => {
  console.log("Hi from index root!");
  res.status(200).json({ Message: "Hi from index root!" });
};
