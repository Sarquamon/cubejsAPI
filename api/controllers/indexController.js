exports.indexRoot = (req, res, next) => {
  res.status(200).json({ Message: "Hi from index root!" });
};
