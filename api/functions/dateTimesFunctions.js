const DateTimes = require("../../models/DateTimes");

exports.saveDateTime = async (msg) => {
  //   const { msg } = req.params;
  try {
    const result = await DateTimes.create({
      MSG: msg,
    });

    if (result) {
      console.log("Success! Saved datetime\n" /* , result */);
      //   res.status(201).json({
      //     Message: "Success! saved datetime",
      //     result: result,
      //   });
      return result.ID_DATETIME;
    } else {
      console.log("Error!\n", err);
      //   res.status(500).json({
      //     Message: "Error!",
      //     err: err,
      //   });
      return null;
    }
  } catch (err) {
    console.log("Error!\n", err);
    // res.status(500).json({
    //   Message: "Error!",
    //   err: err,
    // });
    return null;
  }
};
