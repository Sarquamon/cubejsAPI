const DateTimes = require("../../models/DateTimes");

exports.saveDateTime = async (msg) => {
  try {
    const result = await DateTimes.create({
      MSG: msg,
    });

    if (result) {
      console.log("Success! Saved datetime\n");
      return result.ID_DATETIME;
    } else {
      console.log("Error!\n", err);
      return null;
    }
  } catch (err) {
    console.log("Error!\n", err);
    return null;
  }
};
