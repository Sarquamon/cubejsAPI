const DateTimes = require("../../models/DateTimes");

exports.saveDateTime = async (msg) => {
  try {
    const result = await DateTimes.create({
      MSG: msg,
    });

    if (result) {
      console.log("Success! Saved datetime\n");
      return result.ID_DATETIME;
    }
    console.log("Error!\n");
    return null;
  } catch (err) {
    console.log("Error!\n", err);
    return null;
  }
};
